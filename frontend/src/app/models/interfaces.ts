export interface Object {
    value: string;
    viewValue: string;
  }
  
  export interface Country {
    value: string;
    viewValue: string;
  }
  
  export interface City {
    value: string;
    viewValue: string;
  }
  
  export interface Industry {
    value: string;
    viewValue: string;
  }
  
  export interface Year {
    value: number;
    viewValue: string;
  }

  export interface Building {
    value: number;
    viewValue: string;
  }
  
  export const countries: Country[] = [
    { value: 'Greece', viewValue: 'Greece' },
    { value: 'Netherlands', viewValue: 'Netherlands' },
    { value: 'France', viewValue: 'France' },
    { value: 'UK', viewValue: 'UK' },
    { value: 'USA', viewValue: 'USA' },
    { value: 'Germany', viewValue: 'Germany' },
    { value: 'Other', viewValue: 'Other' },
  ];
  
  export const cities: City[] = [
    { value: 'Athens', viewValue: 'Athens' },
    { value: 'Thessaloniki', viewValue: 'Thessaloniki' },
    { value: 'Larissa', viewValue: 'Larissa' },
    { value: 'Volos', viewValue: 'Volos' },
    { value: 'Patra', viewValue: 'Patra' },
    { value: 'Heraklion', viewValue: 'Heraklion' },
    { value: 'Chania', viewValue: 'Chania' },
    { value: 'Other', viewValue: 'Other' },
  ];
  
  export const industries: Industry[] = [
    { value: 'Technology', viewValue: 'Technology' },
    { value: 'Healthcare', viewValue: 'Healthcare' },
    { value: 'Finance', viewValue: 'Finance' },
    { value: 'Manufacturing', viewValue: 'Manufacturing' },
    { value: 'Education', viewValue: 'Education' },
    { value: 'Retail', viewValue: 'Retail' },
    { value: 'Hospitality', viewValue: 'Hospitality' },
    { value: 'Real_estate', viewValue: 'Real Estate' },
    { value: 'Transportation', viewValue: 'Transportation' },
    { value: 'Energy', viewValue: 'Energy' },
    { value: 'Agriculture', viewValue: 'Agriculture' },
    { value: 'Construction', viewValue: 'Construction' },
    { value: 'Media', viewValue: 'Media' },
    { value: 'Consulting', viewValue: 'Consulting' },
    { value: 'Legal', viewValue: 'Legal' },
    { value: 'Other', viewValue: 'Other' },
  ];
  export const years: Year[] = [
    { value: 2024, viewValue: '2024' },
    { value: 2023, viewValue: '2023' },
    { value: 2022, viewValue: '2022' },
    { value: 2021, viewValue: '2021' },
    { value: 2020, viewValue: '2020' },
    { value: 2019, viewValue: '2019' },
    { value: 2018, viewValue: '2018' },
    { value: 2017, viewValue: '2017' },
    { value: 2016, viewValue: '2016' },
    { value: 2015, viewValue: '2015' },
    { value: 2014, viewValue: '2014' },
    { value: 2013, viewValue: '2013' },
    { value: 2012, viewValue: '2012' },
    { value: 2011, viewValue: '2011' },
    { value: 2010, viewValue: '2010' },
    { value: 2009, viewValue: '2009' },
    { value: 2008, viewValue: '2008' },
    { value: 2007, viewValue: '2007' },
    { value: 2006, viewValue: '2006' },
    { value: 2005, viewValue: '2005' },
    { value: 2004, viewValue: '2004' },
    { value: 2003, viewValue: '2003' },
    { value: 2002, viewValue: '2002' },
    { value: 2001, viewValue: '2001' },
    { value: 2000, viewValue: '2000' },
    { value: 1999, viewValue: '1999' },
    { value: 1998, viewValue: '1998' },
    { value: 1997, viewValue: '1997' },
    { value: 1996, viewValue: '1996' },
    { value: 1995, viewValue: '1995' },
    { value: 1994, viewValue: '1994' },
    { value: 1993, viewValue: '1993' },
    { value: 1992, viewValue: '1992' },
    { value: 1991, viewValue: '1991' },
    { value: 1990, viewValue: '1990' },
    { value: 1989, viewValue: '1989' },
    { value: 1988, viewValue: '1988' },
    { value: 1987, viewValue: '1987' },
    { value: 1986, viewValue: '1986' },
    { value: 1985, viewValue: '1985' },
    { value: 1984, viewValue: '1984' },
    { value: 1983, viewValue: '1983' },
    { value: 1982, viewValue: '1982' },
    { value: 1981, viewValue: '1981' },
    { value: 1980, viewValue: '1980' },
    { value: 1979, viewValue: '1979' },
    { value: 1978, viewValue: '1978' },
    { value: 1977, viewValue: '1977' },
    { value: 1976, viewValue: '1976' },
    { value: 1975, viewValue: '1975' },
    { value: 1974, viewValue: '1974' },
    { value: 1973, viewValue: '1973' },
    { value: 1972, viewValue: '1972' },
    { value: 1971, viewValue: '1971' },
    { value: 1970, viewValue: '1970' },
    { value: 1969, viewValue: '1969' },
    { value: 1968, viewValue: '1968' },
    { value: 1967, viewValue: '1967' },
    { value: 1966, viewValue: '1966' },
    { value: 1965, viewValue: '1965' },
    { value: 1964, viewValue: '1964' },
    { value: 1963, viewValue: '1963' },
    { value: 1962, viewValue: '1962' },
    { value: 1961, viewValue: '1961' },
    { value: 1960, viewValue: '1960' },
    { value: 1959, viewValue: '1959' },
    { value: 1958, viewValue: '1958' },
    { value: 1957, viewValue: '1957' },
    { value: 1956, viewValue: '1956' },
    { value: 1955, viewValue: '1955' },
    { value: 1954, viewValue: '1954' },
    { value: 1953, viewValue: '1953' },
    { value: 1952, viewValue: '1952' },
    { value: 1951, viewValue: '1951' },
    { value: 1950, viewValue: '1950' },
  ];

export const buildings: Building[] = [
  { value: 1, viewValue: '1' },
  { value: 2, viewValue: '2' },
  { value: 3, viewValue: '3' },
  { value: 4, viewValue: '4' },
  { value: 5, viewValue: '5' },
  { value: 6, viewValue: '6' },
  { value: 7, viewValue: '7' },
  { value: 8, viewValue: '8' },
  { value: 9, viewValue: '9' },
  { value: 10, viewValue: '10' },
];