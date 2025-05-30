# Rejection Insights

![Rejection Insights Logo](https://img.shields.io/badge/Rejection-Insights-7b68ee?style=for-the-badge)

A powerful AI tool that helps job seekers understand potential reasons for job rejections and improve their application materials and interview skills.

## Access the Application

**[Try Rejection Insights Now](https://ma-sohail.github.io/Rejection-insights/)**

Need test data? Jump to [Sample Resume](#sample-resume) and [Sample Job Description](#sample-job-description) to quickly copy and paste examples.

## Overview

Rejection Insights is an interactive web application that leverages the Google Gemini API to provide personalized feedback on job applications. The tool analyzes job descriptions against resumes and simulates mock interviews to identify potential gaps and areas for improvement.

## Features

- **Job Description Analysis**: Upload job descriptions to identify key requirements and qualifications.
- **Resume Assessment**: Compare your resume against job descriptions to find matches and gaps.
- **Mock Interviews**: Practice with an AI interviewer that asks relevant questions based on the job description.
- **Detailed Analysis**: Receive comprehensive insights on:
  - Most probable reasons for rejection
  - Resume-job match score
  - Key skill gaps and missing qualifications
  - Resume strengths
  - Areas for improvement
  - Interview performance feedback
  - Actionable recommendations

## Technology Stack

- HTML5, CSS3, and JavaScript
- Google Gemini API for AI-powered analysis
- Responsive design for mobile and desktop
- LocalStorage for client-side data management
- No server-side dependencies - runs entirely in the browser

## Privacy & Security

- Your data remains private and is stored only in your browser's local storage
- API keys are stored locally and never sent to any external server
- No personal information is shared with third parties

## How to Use

1. **Setup**: Enter your Google Gemini API key (obtain one from [Google AI Studio](https://aistudio.google.com/apikey))
2. **Job Description**: Paste the job description you're interested in
3. **Resume**: Enter your resume content
4. **Interview**: Complete a mock interview with AI
5. **Analysis**: Review the comprehensive analysis and recommendations
6. **Download**: Save your analysis for future reference

## Installation

No installation required! This is a web-based application that runs in your browser. Simply visit [https://ma-sohail.github.io/Rejection-insights/](https://ma-sohail.github.io/Rejection-insights/) to get started.

### Local Development

If you want to run the application locally:

1. Clone the repository:

```
git clone https://github.com/yourusername/rejection-insights.git
```

2. Open the `index.html` file in your browser or use a local server:
```
cd rejection-insights
python -m http.server 8000
```

3. Access the application at http://localhost:8000

## Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it into the Rejection Insights setup screen

## Sample Data for Testing

### Sample Resume

```
John Doe

📍 New York, NY | 📧 john.doe@email.com | 📞 (123) 456-7890 | LinkedIn | GitHub

---

Professional Summary

Detail-oriented Data Analyst with 3+ years of experience in transforming complex datasets into actionable insights. Proficient in statistical analysis, data visualization, and predictive modeling to drive strategic business decisions. Adept at using tools like SQL, Python, Excel, Power BI, and Tableau to optimize processes and deliver data-driven solutions.

---

Technical Skills

Languages & Tools: SQL, Python (Pandas, NumPy, Scikit-learn), Excel (VLOOKUP, PivotTables), Power BI, Tableau, R

Database Management: MySQL, PostgreSQL, MS Access

Data Visualization: Tableau, Power BI, Matplotlib, Seaborn

Statistical Analysis: A/B testing, Regression, Hypothesis Testing

Other: Data Cleaning, ETL, Data Warehousing, Business Intelligence

---

Professional Experience

Data Analyst | ABC Corporation, New York, NY
Jan 2022 – Present

Analyzed large datasets using SQL and Python to identify trends and optimize operational performance, resulting in a 15% increase in efficiency.

Developed interactive dashboards in Power BI for executive leadership, improving decision-making speed by 25%.

Collaborated with cross-functional teams to design A/B tests and interpret results, leading to 10% revenue growth.

Automated data cleaning processes, reducing manual effort by 30%.


Junior Data Analyst | XYZ Solutions, New York, NY
Aug 2020 – Dec 2021

Assisted in data extraction and reporting using SQL queries and Excel.

Built Tableau dashboards for sales and marketing teams to monitor KPIs.

Conducted trend and variance analysis to support quarterly business reviews.

Improved data quality by performing regular audits and corrections.

---

Education

Bachelor of Science in Statistics
University of New York, New York, NY
Graduated: May 2020

---

Certifications

Google Data Analytics Certificate

Microsoft Power BI Data Analyst Associate

---

Projects

Customer Churn Prediction: Developed a machine learning model in Python to predict customer churn with 85% accuracy.

Sales Performance Dashboard: Designed a Tableau dashboard that provided real-time insights into sales performance, used by senior management.

Inventory Optimization: Analyzed inventory data and created a forecasting model, reducing stockouts by 20%.

---

Professional Affiliations

Member, Data Visualization Society

Member, Association for Computing Machinery (ACM)

---

Soft Skills

Strong analytical and problem-solving skills

Excellent communication and presentation skills

Collaborative team player with a proactive mindset
```

### Sample Job Description

```
Job Title: Data Analyst

Location: New York, NY (Hybrid/Remote)
Reports To: Data Analytics Manager

---

Job Summary

We are seeking a Data Analyst to join our growing analytics team. This role is responsible for collecting, processing, and analyzing data to generate actionable insights that drive business decision-making. The ideal candidate will have strong analytical skills, experience with data visualization tools, and proficiency in SQL and Python.

---

Key Responsibilities

Collect and analyze data from various sources (SQL databases, Excel files, APIs) to support business initiatives.

Develop, maintain, and automate interactive dashboards and reports in Power BI or Tableau.

Collaborate with cross-functional teams (Marketing, Operations, Finance) to identify key business questions and deliver insights.

Perform statistical analysis (e.g., hypothesis testing, regression models) to identify trends and opportunities.

Clean and preprocess large datasets, ensuring data quality and integrity.

Communicate insights and recommendations to stakeholders through presentations and reports.

Support A/B testing and interpret results to guide marketing and product strategies.

Continuously explore new tools, methods, and data sources to improve analysis capabilities.

---

Qualifications

Bachelor's degree in Data Science, Statistics, Mathematics, Computer Science, or a related field.

1-3 years of experience in data analysis or business intelligence.

Proficient in SQL for data extraction and manipulation.

Strong skills in Excel (including PivotTables, VLOOKUP, and advanced formulas).

Experience with Power BI or Tableau for data visualization.

Knowledge of Python or R for data analysis is a plus.

Familiarity with statistical methods (hypothesis testing, correlation analysis).

Strong problem-solving and critical thinking skills.

Excellent written and verbal communication skills.

---

Preferred Qualifications

Experience with cloud platforms (AWS, GCP, Azure).

Familiarity with ETL processes and data warehousing concepts.

Certification in Google Data Analytics, Power BI, or similar.

---

Why Join Us?

Collaborative and inclusive work environment.

Opportunities for professional growth and upskilling.

Competitive salary and benefits package.

Flexible hybrid/remote working arrangements
```

## Limitations

- The analysis is based solely on the information you provide
- Results are generated by AI and should be used as guidance, not definitive assessments
- Mock interviews simulate common questions but may not perfectly match actual employer interviews

## Future Enhancements

- Resume file upload functionality
- Additional career development resources
- Expanded interview question database
- Integration with job boards
- Company-specific insights

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to improve the application.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created with ❤️ to help job seekers improve their career prospects.
