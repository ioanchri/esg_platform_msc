import os
from fastapi import UploadFile
import shutil
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image,
    Table,
    TableStyle,
    PageBreak,
)

UPLOAD_DIRECTORY = "uploads\pdf_files"


def save_uploaded_file(
    upload_file: UploadFile, filename: str, subdirectory: str
) -> str:
    directory_path = os.path.join(UPLOAD_DIRECTORY, subdirectory)
    os.makedirs(directory_path, exist_ok=True)
    file_path = os.path.join(directory_path, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return file_path


from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image,
    Table,
    TableStyle,
    PageBreak,
)
from io import BytesIO

# PDF Generation Funcionality

def generate_company_pdf(company, metrics):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []

    # Define styles
    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    subtitle_style = styles["Heading2"]
    body_style = styles["BodyText"]
    section_title_style = ParagraphStyle(
        name="SectionTitle",
        parent=styles["Heading3"],
        fontSize=12,
        leading=14,
        spaceAfter=6,
    )

    # Define table style
    table_style = TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),  
            ("BOTTOMPADDING", (0, 0), (-1, 0), 2),  
            ("TOPPADDING", (0, 0), (-1, 0), 2), 
            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ]
    )

    # Add company logo
    logo_path = "uploads/logo1.jpg"
    elements.append(Image(logo_path, width=100, height=50))
    elements.append(Spacer(1, 12))

    # Add title
    elements.append(Paragraph("Company Report", title_style))
    elements.append(Spacer(1, 12))

    # Add company details
    company_details = f"""
    <b>Company Name:</b> {company.name}<br/>
    <b>Industry:</b> {company.industry}<br/>
    <b>Contact Email:</b> {company.contact_email}<br/>
    <b>Website:</b> {company.website}<br/>
    <b>Phone Number:</b> {company.phone_number}<br/>
    <b>Year Founded:</b> {company.year_founded}<br/>
    <b>Country:</b> {company.country}<br/>
    <b>City:</b> {company.city}<br/>
    <b>Address:</b> {company.address}<br/>
    <b>Postal Code:</b> {company.postal_code}
    """
    elements.append(Paragraph(company_details, body_style))
    elements.append(Spacer(1, 12))

    # Add year
    if metrics["environmental"]:
        year = metrics["environmental"][0].year
    elif metrics["social"]:
        year = metrics["social"][0].year
    elif metrics["governance"]:
        year = metrics["governance"][0].year
    else:
        year = "N/A"
    elements.append(Paragraph(f"Reporting Year: {year}", subtitle_style))
    elements.append(Spacer(1, 12))

    # Add environmental metrics
    elements.append(Paragraph("Environmental Metrics", subtitle_style))
    elements.append(Spacer(1, 12))

    # Electricity and Gas Consumption
    elements.append(Paragraph("Electricity and Gas Consumption", section_title_style))
    elements.append(Spacer(1, 12))
    env_data_1 = [["Electricity Consumption (kWh)", "Gas Consumption (liters)"]]
    for metric in metrics["environmental"]:
        env_data_1.append([metric.electricity_consumption, metric.gas_consumption])
    env_table_1 = Table(env_data_1,hAlign="LEFT")
    env_table_1.setStyle(table_style)
    elements.append(env_table_1)
    elements.append(Spacer(1, 12))

    # Car Consumption
    elements.append(Paragraph("Vehicles Section", section_title_style))
    elements.append(Spacer(1, 12))
    env_data_2 = [
        [
            "Car Diesel Consumption (liters)",
            "Car Fuel Consumption (liters)",
            "Car Electricity Consumption (kWh)",
        ]
    ]
    for metric in metrics["environmental"]:
        env_data_2.append(
            [
                metric.car_diesel_consumption,
                metric.car_fuel_consumption,
                metric.car_electricity_consumption,
            ]
        )
    env_table_2 = Table(env_data_2, hAlign="LEFT")
    env_table_2.setStyle(table_style)
    elements.append(env_table_2)
    elements.append(Spacer(1, 12))

    # Waste
    elements.append(Paragraph("Waste", section_title_style))
    elements.append(Spacer(1, 12))
    env_data_3 = [["Hazardous Waste (kg)", "Non-Hazardous Waste (kg)"]]
    for metric in metrics["environmental"]:
        env_data_3.append([metric.hazardous_waste, metric.non_hazardous_waste])
    env_table_3 = Table(env_data_3, hAlign="LEFT")
    env_table_3.setStyle(table_style)
    elements.append(env_table_3)
    elements.append(Spacer(1, 12))
    elements.append(PageBreak())

    # Add social metrics
    elements.append(Paragraph("Social Metrics", subtitle_style))
    elements.append(Spacer(1, 12))

    # WorkForce Characteristics
    elements.append(Paragraph("WorkForce Characteristics", section_title_style))
    elements.append(Spacer(1, 12))
    soc_data_1 = [
        [
            "No of Employees",
            "Male Employees",
            "Female Employees",
            "Permanent Employees",
        ],
    ]
    soc_data_11 = [
        ["Temporary Employees", "Full Time Employees", "Part Time Employees"]
    ]
    for metric in metrics["social"]:
        soc_data_1.append(
            [
                metric.no_of_employees,
                metric.male_employees,
                metric.female_employees,
                metric.permanent_employees,
            ]
        )
        soc_data_11.append(
            [
                metric.temporary_employees,
                metric.full_time_employees,
                metric.part_time_employees,
            ]
        )
    soc_table_1 = Table(soc_data_1, hAlign="LEFT")
    soc_table_1.setStyle(table_style)
    elements.append(soc_table_1)
    elements.append(Spacer(1, 4))

    soc_table_11 = Table(soc_data_11, hAlign="LEFT")
    soc_table_11.setStyle(table_style)
    elements.append(soc_table_11)
    elements.append(Spacer(1, 12))

    # New Hires Turnover
    elements.append(Paragraph("New Hires Turnover", section_title_style))
    elements.append(Spacer(1, 12))
    soc_data_3 = [
        [
            "New Employees",
            "Employees Left",
            "Voluntary Turnover (%)",
            "Involuntary Turnover (%)",
        ]
    ]
    for metric in metrics["social"]:
        soc_data_3.append(
            [
                metric.new_employees,
                metric.employees_left,
                metric.voluntary_turnover,
                metric.involuntary_turnover,
            ]
        )
    soc_table_3 = Table(soc_data_3, hAlign="LEFT")
    soc_table_3.setStyle(table_style)
    elements.append(soc_table_3)
    elements.append(Spacer(1, 12))

    # Compensation
    elements.append(Paragraph("Compensation", section_title_style))
    elements.append(Spacer(1, 12))
    soc_data_4 = [["Avg Hourly Earnings Male", "Avg Hourly Earnings Female"]]
    soc_data_44 = [
        ["CEO Total Compensation", "Median Employee Total Compensation", "Pay Ratio"]
    ]
    for metric in metrics["social"]:
        soc_data_4.append(
            [
                metric.avg_hourly_earnings_male,
                metric.avg_hourly_earnings_female,
            ]
        )
        soc_data_44.append(
            [
                metric.ceo_total_compensation,
                metric.median_employee_total_compensation,
                metric.pay_ratio,
            ]
        )
    soc_table_4 = Table(soc_data_4, hAlign="LEFT")
    soc_table_4.setStyle(table_style)
    elements.append(soc_table_4)
    elements.append(Spacer(1, 4))
    soc_table_44 = Table(soc_data_44, hAlign="LEFT")
    soc_table_44.setStyle(table_style)
    elements.append(soc_table_44)
    elements.append(Spacer(1, 12))

    # Anti-Corruption
    elements.append(Paragraph("Anti-Corruption", section_title_style))
    elements.append(Spacer(1, 12))
    gov_data_1 = [["Anti Corruption Policies"]]
    for metric in metrics["governance"]:
        gov_data_1.append([metric.anti_corruption_text])
    gov_table_1 = Table(gov_data_1, hAlign="LEFT")
    gov_table_1.setStyle(table_style)
    elements.append(gov_table_1)
    elements.append(Spacer(1, 12))

    # Whistleblowing
    elements.append(Paragraph("Whistleblowing", section_title_style))
    elements.append(Spacer(1, 12))
    gov_data_2 = [["Whistleblowing Policies"]]
    for metric in metrics["governance"]:
        gov_data_2.append([metric.whistleblowing_text])
    gov_table_2 = Table(gov_data_2, hAlign="LEFT")
    gov_table_2.setStyle(table_style)
    elements.append(gov_table_2)
    elements.append(Spacer(1, 12))

    # Corporate Culture
    elements.append(Paragraph("Corporate Culture", section_title_style))
    elements.append(Spacer(1, 12))
    gov_data_3 = [["Corporate Culture Policies"]]
    for metric in metrics["governance"]:
        gov_data_3.append([metric.corporate_culture_text])
    gov_table_3 = Table(gov_data_3, hAlign="LEFT")
    gov_table_3.setStyle(table_style)
    elements.append(gov_table_3)
    elements.append(Spacer(1, 12))
    elements.append(PageBreak())

    # Business Conduct
    elements.append(Paragraph("Business Conduct", section_title_style))
    elements.append(Spacer(1, 12))
    gov_data_4 = [["Business Conduct Policies"]]
    for metric in metrics["governance"]:
        gov_data_4.append([metric.business_conduct_text])
    gov_table_4 = Table(gov_data_4, hAlign="LEFT")
    gov_table_4.setStyle(table_style)
    elements.append(gov_table_4)
    elements.append(Spacer(1, 12))

    # Build the PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer
