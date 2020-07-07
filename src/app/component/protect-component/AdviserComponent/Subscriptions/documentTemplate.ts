export const quotationTemplate = ` <div > <p><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">Quotation for $plan_name</span></p>
<p><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">Date: ___________</span></p>
<p><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">Dear $client_name,</span></p>
<p><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">Greetings from $company_name!</span></p>
<p><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">It was great to have a discussion on the different plans that $company_name provides. Thank you for allowing us to propose our $plan_name. The services cover important areas of your personal finance such as $service_name.</span></p>
<p><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">We recommend you the following segments of financial planning after prudently analyzing your data:</span></p>
<p><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);"><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">$service_fee</span></span>
</p>
<p><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">SERVICE QUOTATION TERMS</span>
	<br style="box-sizing: inherit; caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px;"><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">• &nbsp; &nbsp;This quotation will be valid for 15 days from the date of this Statement of Work.</span>
	<br style="box-sizing: inherit; caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px;"><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">• &nbsp; &nbsp;We agree to keep confidential all the information received from you during the financial plan and execution of the agreed services.</span>
	<br style="box-sizing: inherit; caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px;"><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">• &nbsp; &nbsp;Our fees will only include the $plan_name mentioned above.&nbsp;</span>
	<br style="box-sizing: inherit; caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px;"><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">• &nbsp; &nbsp;The above fees are one-time annual charges valid for 12 months from the date of the plan.&nbsp;</span>
	<br style="box-sizing: inherit; caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px;"><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">• &nbsp; &nbsp;Extra fees will be charged for other matters not included herein.&nbsp;</span>
	<br style="box-sizing: inherit; caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px;"><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">• &nbsp; &nbsp;We will need your utmost cooperation in providing the required information to enable us to render you the services agreed upon.&nbsp;</span>
	<br style="box-sizing: inherit; caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px;"><span style="caret-color: rgb(29, 28, 29); color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; background-color: rgb(248, 248, 248);">• &nbsp; &nbsp;Payment terms would be as per invoice.</span></p>`



export const detailsOfClientTemplate = `
	
<p>DETAILS OF CLIENT</p>
<p>Full Name : $client_name</p>
<p>Residential address : $client_address</p>
<p>Email ID: $client_email</p>
<p>Mobile No.: $client_mobile</p>
<p>PAN: $client_PAN</p>
<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"></p>	`


export const redressalofGrievance = `

<p>REDRESSAL OF GRIEVANCE</p>
<p>We welcome your feedback, as it helps us improve our products and services for our clients.&nbsp;</p>
<p>1. &nbsp; &nbsp;You can contact us in person, in writing, by email or by telephone at the following:&nbsp;</p>
<p>$company_display_name,</p>
<p>$biller_profile_address,&nbsp;</p>
<p>$biller_profile_city - $biller_profile_PIN</p>
<p>Website:$organization_profile_website &nbsp;Tel:$organization_profile_mobile</p>
<p>Email:$organization_profile_email</p>
<p>
	<br>
</p>
<p>If a client is not satisfied with the services and would like to lodge a complaint, the client is requested to first talk to the authorized representative/investment advisors from the Investment Advisers Department. The Client can discuss and be rest assured that the complaint will be resolved on the best effort basis within seven working days.</p>
<p>&nbsp;If you send us a complaint by email, we will normally respond to you in writing but we may also choose to respond by return email or by telephone.</p>
<p>1. &nbsp; &nbsp;The Client is requested to provide the following information: • name and address • a clear description of the concern or complaint • details of what the client would like to do to resolve the complaint • copies of any relevant documents/information • a daytime telephone number where the Client can be contacted.</p>
<p>2. &nbsp; &nbsp;If the Client is still not satisfied with the response or the handling of the complaint by the authorized representative/investment advisors, the Client can approach and write an email to $admin_advisor_name, Director of $company_display_name at $admin_advisor_email with complete details. $admin_advisor_name will get in touch with you at the earliest and try to resolve your complaint as soon as possible.</p>
<p>3. &nbsp; &nbsp;If the complaint is not resolved within a period of one month, the Client may refer the complaint to the regulator - The Securities and Exchange Board of India (SEBI).</p>
<p>SEBI has launched a centralized web-based complaints redress system 'SCORES'. The link to the platform is https://scores.gov.in/scores/complaintRegister.html#</p>
<p>
	<br>
</p>
<p>Alternatively, the Client can write to SEBI at the following address.</p>
<p>Office of Investor Assistance and Education,&nbsp;</p>
<p>SEBI Bhavan Plot No.C4-A,G Block, BandraKurla Complex,</p>
<p>Bandra (E) Mumbai 400 051&nbsp;</p>
<p>Telephone: +91-22-2644 9000 / 4045 9000</p>
<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"></p>
`


export const letterOfEngagement = `

<p>SCOPE OF SERVICES</p>
<p>
	<br>
</p>
<p>The financial planning process consists of the following six steps:&nbsp;</p>
<p>a)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Defining the terms of customer &amp; advisor relationship.&nbsp;</p>
<p>b)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Discussing customer’s financial goals and obtaining financial data.&nbsp;</p>
<p>c)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Evaluating customer’s current situation based on the information provided.&nbsp;</p>
<p>d)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Developing financial planning strategies and presenting them to the customer.</p>
<p>e)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Implementing some or all of the strategies outlined in the financial plan.&nbsp;</p>
<p>f)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Monitoring and revising the financial plan as necessary.</p>
<p>
	<br>
</p>
<p>Customer hereby engages the advisor to provide $service_name which includes: performing analysis on behalf of Customer; preparing appropriate recommendations for Customer, and conducting meetings with Customer.&nbsp;</p>
<p>&nbsp;&nbsp;</p>
<p>a)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Gathering customer’s relevant information pertaining to financial circumstances; identifying goals, objectives, priorities, concerns, time-horizon, tolerance for risk, and other preferences as specified.&nbsp;</p>
<p>b)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Summarizing the current financial situation which includes net-worth, cash flow summary, budget, insurance, and income tax analysis.&nbsp;</p>
<p>c)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Reviewing the current investment portfolio and developing an asset management strategy.&nbsp;</p>
<p>d)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Developing a financial management strategy, including financial projections, market &amp; product research.&nbsp;</p>
<p>e)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Assessing exposure to financial risk and developing a risk management plan.&nbsp;</p>
<p>f)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Completing a retirement planning assessment, including financial projections of assets based on the estimated retirement date.&nbsp;</p>
<p>g)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Assessing estate net worth and liquidity and developing an estate plan to ensure estate planning objectives are met.</p>
<p>h)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Identifying tax planning strategies to optimize a customer’s financial position.&nbsp;</p>
<p>i)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Integrating and prioritizing all strategies outlined above into a comprehensive financial plan.&nbsp;</p>
<p>j)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Presenting a written financial plan that will be reviewed in detail; it will contain recommendations designed to meet stated goals and objectives, supported by relevant financial summaries.&nbsp;</p>
<p>k)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Developing an action plan to implement the agreed-upon recommendations.&nbsp;</p>
<p>l)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Refer to other professionals, as required.</p>
<p>m)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Assist with the implementation of the action plan.</p>
<p>n)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Monitoring financial performance in relation to the financial plan.&nbsp;</p>
<p>o)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Reviewing and assessing, on an on-going basis, the assumptions incorporated into the financial plan given changes in the economic, political, and regulatory environment.&nbsp;</p>
<p>
	<br>
</p>
<p>Review and Monitoring:&nbsp;</p>
<p>This will be on an annual basis to ensure the plan is still appropriate. The annual plan review will include:&nbsp;</p>
<p>a)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Discussing any material change in circumstances in the customer’s financial situation or financial goals as well as changes to the economic environment and how it may impact the recommendations made in the financial plan.</p>
<p>b)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Advising any material changes in the economic conditions or the law.&nbsp;</p>
<p>c)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Discussing the need to change any assumptions made in the financial plan.&nbsp;</p>
<p>d)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Adjusting the recommendations to accommodate any changes in circumstances or assumptions.</p>
<p>e)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Confirming what recommendations have been implemented as part of the action plan.&nbsp;</p>
<p>f)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Updating financial and personal information.</p>
<p>g)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Incorporating any material changes in the economic environment.&nbsp;</p>
<p>h)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Updating the recommendations to reflect the above changes.</p>
<p>Service fee:</p>
<p>$service_fee</p>
<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"></p>
<br>
<p>DETAILS OF CLIENT</p>
<p>Full Name : $client_name</p>
<p>Residential address : $client_address</p>
<p>Email ID: $client_email</p>
<p>Mobile No.: $client_mobile</p>
<p>PAN: $client_PAN</p>
<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"></p> 
`
export const scopeofService = `

<p>SCOPE OF SERVICES</p>
<p>
	<br>
</p>
<p>The financial planning process consists of the following six steps:&nbsp;</p>
<p>a)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Defining the terms of customer &amp; advisor relationship.&nbsp;</p>
<p>b)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Discussing customer’s financial goals and obtaining financial data.&nbsp;</p>
<p>c)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Evaluating customer’s current situation based on the information provided.&nbsp;</p>
<p>d)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Developing financial planning strategies and presenting them to the customer.</p>
<p>e)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Implementing some or all of the strategies outlined in the financial plan.&nbsp;</p>
<p>f)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Monitoring and revising the financial plan as necessary.</p>
<p>
	<br>
</p>
<p>Customer hereby engages the advisor to provide $service_name which includes: performing analysis on behalf of Customer; preparing appropriate recommendations for Customer, and conducting meetings with Customer.&nbsp;</p>
<p>&nbsp;&nbsp;</p>
<p>a)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Gathering customer’s relevant information pertaining to financial circumstances; identifying goals, objectives, priorities, concerns, time-horizon, tolerance for risk, and other preferences as specified.&nbsp;</p>
<p>b)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Summarizing the current financial situation which includes net-worth, cash flow summary, budget, insurance, and income tax analysis.&nbsp;</p>
<p>c)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Reviewing the current investment portfolio and developing an asset management strategy.&nbsp;</p>
<p>d)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Developing a financial management strategy, including financial projections, market &amp; product research.&nbsp;</p>
<p>e)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Assessing exposure to financial risk and developing a risk management plan.&nbsp;</p>
<p>f)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Completing a retirement planning assessment, including financial projections of assets based on the estimated retirement date.&nbsp;</p>
<p>g)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Assessing estate net worth and liquidity and developing an estate plan to ensure estate planning objectives are met.</p>
<p>h)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Identifying tax planning strategies to optimize a customer’s financial position.&nbsp;</p>
<p>i)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Integrating and prioritizing all strategies outlined above into a comprehensive financial plan.&nbsp;</p>
<p>j)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Presenting a written financial plan that will be reviewed in detail; it will contain recommendations designed to meet stated goals and objectives, supported by relevant financial summaries.&nbsp;</p>
<p>k)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Developing an action plan to implement the agreed-upon recommendations.&nbsp;</p>
<p>l)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Refer to other professionals, as required.</p>
<p>m)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Assist with the implementation of the action plan.</p>
<p>n)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Monitoring financial performance in relation to the financial plan.&nbsp;</p>
<p>o)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Reviewing and assessing, on an on-going basis, the assumptions incorporated into the financial plan given changes in the economic, political, and regulatory environment.&nbsp;</p>
<p>
	<br>
</p>
<p>Review and Monitoring:&nbsp;</p>
<p>This will be on an annual basis to ensure the plan is still appropriate. The annual plan review will include:&nbsp;</p>
<p>a)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Discussing any material change in circumstances in the customer’s financial situation or financial goals as well as changes to the economic environment and how it may impact the recommendations made in the financial plan.</p>
<p>b)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Advising any material changes in the economic conditions or the law.&nbsp;</p>
<p>c)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Discussing the need to change any assumptions made in the financial plan.&nbsp;</p>
<p>d)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Adjusting the recommendations to accommodate any changes in circumstances or assumptions.</p>
<p>e)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Confirming what recommendations have been implemented as part of the action plan.&nbsp;</p>
<p>f)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Updating financial and personal information.</p>
<p>g)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Incorporating any material changes in the economic environment.&nbsp;</p>
<p>h)<span style="white-space:pre;">&nbsp; &nbsp;&nbsp;</span>Updating the recommendations to reflect the above changes.</p>
<p>Service fee:</p>
<p>$service_fee</p>
<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;"></p>
`