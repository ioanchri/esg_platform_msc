import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CO2EmissionsService } from '../../services/co2emissions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service';
import { GoalService, Goal } from '../../services/goal.service';
import { CompanyService } from '../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { AppGovernanceMetricsGoalsComponent } from '../governance-metrics-goals/governance-metrics-goals.component';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AppGovernanceMetricsGoalsComponent,
  ],
})
export class GoalsComponent implements OnInit {
  goalsForm: FormGroup;
  genderGapForm: FormGroup;
  currentCO2Emissions: number = 0;
  targetYear: number = new Date().getFullYear();
  currentYear: number = new Date().getFullYear();
  targetPercentage: number = 0;
  companyId: number | null = null;
  goals: Goal[] = [];
  currentMaleEmployees: number = 0;
  currentFemaleEmployees: number = 0;
  currentMalePercentage: number = 0;
  currentFemalePercentage: number = 0;
  currentTotalEmployees: number = 0;

  co2Goals: Goal[] = [];
  genderGoals: Goal[] = [];

  constructor(
    private fb: FormBuilder,
    private co2EmissionsService: CO2EmissionsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private goalService: GoalService,
    private companyService: CompanyService,
    private dialog: MatDialog
  ) {
    this.goalsForm = this.fb.group({
      targetYear: [this.targetYear, Validators.required],
      created_at: [new Date().toISOString()],
      targetPercentage: [
        this.targetPercentage,
        [Validators.required, Validators.min(1), Validators.max(99)],
      ],
    });

    this.genderGapForm = this.fb.group({
      targetYear: [this.targetYear, Validators.required],
      targetMaleEmployees: [0, Validators.required],
      targetFemaleEmployees: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCurrentCO2Emissions();
    this.setCompanyId();
    this.loadGenderEmploymentData();
  }

  setCompanyId(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.userService.getUserByUsername(username).subscribe((user: User) => {
        if (user && user.company_id) {
          this.companyId = user.company_id;
          this.loadCurrentCO2Emissions();
          this.loadCompanyGoals();
          this.loadGenderEmploymentData();
        }
      });
    }
  }

  loadCompanyGoals(): void {
    if (this.companyId) {
      this.goalService.getGoalsByCompany(this.companyId).subscribe((goals) => {
        this.goals = goals;
        this.co2Goals = goals.filter(g => g.goal_type === 'CO2');
        this.genderGoals = goals.filter(g => g.goal_type === 'Gender');
      });
    }
  }

  loadCurrentCO2Emissions(): void {
    if (this.companyId) {
      this.co2EmissionsService
        .getCO2Emissions(this.companyId)
        .subscribe((data: any) => {
          if (data.length > 0) {
            const lastYearData = data[data.length - 1];
            this.currentCO2Emissions = lastYearData.total_co2;
            this.currentYear = lastYearData.year;
          }
        });
    }
  }

  loadGenderEmploymentData(): void {
    if (this.companyId) {
      this.companyService
        .getGenderRatio(this.companyId)
        .subscribe((data: any) => {
          this.currentMaleEmployees = data.male_employees;
          this.currentFemaleEmployees = data.female_employees;
          this.currentTotalEmployees = this.currentMaleEmployees + this.currentFemaleEmployees;
          this.currentMalePercentage = (this.currentMaleEmployees / this.currentTotalEmployees) * 100;
          this.currentFemalePercentage = (this.currentFemaleEmployees / this.currentTotalEmployees) * 100;
        });
    }
  }

  onSubmit(): void {
    if (this.goalsForm.valid) {
      const targetYear = this.goalsForm.get('targetYear')?.value;
      const targetPercentage = this.goalsForm.get('targetPercentage')?.value;
      const targetCO2 = this.currentCO2Emissions * (1 - targetPercentage / 100);

      const newGoal: Goal = {
        target_year: targetYear,
        target_co2_percentage: targetPercentage,
        target_co2: targetCO2,
        company_id: this.companyId!,
        goal_type: 'CO2',
      };

      this.goalService.createGoal(newGoal).subscribe((goal) => {
        this.goals.push(goal);
        this.co2Goals.push(goal);
        this.snackBar.open(
          `Goal set for ${targetYear} to reduce CO2 emissions by ${targetPercentage}%`,
          'Close',
          {
            duration: 3000,
          }
        );
      });
    }
  }

  onSubmitGenderGapGoal(): void {
    if (this.genderGapForm.valid) {
      const targetYear = this.genderGapForm.get('targetYear')?.value;
      const targetMaleEmployees = this.genderGapForm.get(
        'targetMaleEmployees'
      )?.value;
      const targetFemaleEmployees = this.genderGapForm.get(
        'targetFemaleEmployees'
      )?.value;

      const totalEmployees = targetMaleEmployees + targetFemaleEmployees;
      const targetMalePercentage = (targetMaleEmployees / totalEmployees) * 100;
      const targetFemalePercentage =
        (targetFemaleEmployees / totalEmployees) * 100;

      const newGoal: Goal = {
        target_year: targetYear,
        target_male_percentage: targetMalePercentage,
        target_female_percentage: targetFemalePercentage,
        company_id: this.companyId!,
        goal_type: 'Gender',
      };

      this.goalService.createGoal(newGoal).subscribe((goal) => {
        this.goals.push(goal);
        this.genderGoals.push(goal);
        this.snackBar.open(
          `Goal set for ${targetYear} with ${targetMalePercentage.toFixed(
            2
          )}% male and ${targetFemalePercentage.toFixed(2)}% female employees`,
          'Close',
          {
            duration: 3000,
          }
        );
      });
    }
  }

  confirmDeleteGoal(goal: Goal): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        message: `Are you sure you want to delete the goal for ${goal.target_year}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteGoal(goal);
      }
    });
  }

  deleteGoal(goal: Goal): void {
    this.goalService.deleteGoal(goal.id!).subscribe(() => {
      this.goals = this.goals.filter((g) => g.id !== goal.id);
      if (goal.goal_type === 'CO2') {
        this.co2Goals = this.co2Goals.filter((g) => g.id !== goal.id);
      } else if (goal.goal_type === 'Gender') {
        this.genderGoals = this.genderGoals.filter((g) => g.id !== goal.id);
      }
      this.snackBar.open(`Goal for ${goal.target_year} deleted`, 'Close', {
        duration: 3000,
      });
    });
  }
}