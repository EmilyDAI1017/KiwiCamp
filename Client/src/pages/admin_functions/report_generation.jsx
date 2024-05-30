import React, { useState } from 'react';
import axios from 'axios';

const ReportGeneration = () => {
    const [reportData, setReportData] = useState([]);
    const [currentReport, setCurrentReport] = useState('');

    const fetchReport = async (reportType) => {
        setCurrentReport(reportType);
        try {
            let response;
            switch (reportType) {
                case 'camper-demographics':
                     response = await axios.get('http://localhost:3000/report/camper-demographics');
                    break;
                case 'activity-participation':
                    response = await axios.get('http://localhost:3000/report/activity-participation');
                    break;
                case 'payment-status':
                    response = await axios.get('http://localhost:3000/report/payment-status');
                    break;
                case 'age-distribution':
                    response = await axios.get('http://localhost:3000/report/age-distribution');
                    break;
                case 'health-dietary-requirements':
                    response = await axios.get('http://localhost:3000/report/health-dietary-requirements');
                    break;
                case 'activity-preferences':
                    response = await axios.get('http://localhost:3000/report/activity-preferences');
                    break;
                case 'camp-attendance':
                    response = await axios.get('http://localhost:3000/report/camp-attendance');
                    break;
                case 'group-participation':
                    response = await axios.get('http://localhost:3000/report/group-participation');
                    break;
                case 'accommodation-usage':
                    response = await axios.get('http://localhost:3000/report/accommodation-usage');
                    break;
                case 'payment-summary':
                    response = await axios.get('http://localhost:3000/report/payment-summary');
                    break;
                case 'discount-usage':
                    response = await axios.get('http://localhost:3000/report/discount-usage');
                    break;
                default:
                    return;
            }
            console.log('Fetched Data:', response.data);
            setReportData(response.data);
        } catch (error) {
            console.error(`Error fetching ${reportType} report`, error);
            setReportData([]);
        }
    };

    const renderReportData = () => {
        if (!Array.isArray(reportData) || reportData.length === 0) return <p className="text-gray-500">No data available</p>;
    
        const tableHeaders = {
            'camper-demographics': ['Gender', 'Count'],
            'activity-participation': ['Activity Name', 'Participants'],
            'payment-status': ['Payment Status', 'Count'],
            'age-distribution': ['Age Range', 'Count'],
            'activity-preferences': ['Activity', 'Count'],
            'camp-attendance': ['Camp', 'Attendees'],
            'group-participation': ['Group', 'Size'],
            'accommodation-usage': ['Accommodation Type', 'Usage'],
            'payment-summary': ['Payment Status', 'Count', 'Amount'],
            'discount-usage': ['Discount Type', 'Usage'],
        };
    
        const renderTableHeaders = (headers) => (
            <thead>
                <tr className="bg-gray-200">
                    {headers.map((header, index) => (
                        <th key={index} className="py-2 px-4 border-b">{header}</th>
                    ))}
                </tr>
            </thead>
        );
    
        const renderTableRows = (data, keys) => (
            <tbody>
                {data.map((item, index) => (
                    <tr key={index} className={`hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        {keys.map((key, i) => (
                            <td key={i} className="py-2 px-4 border-b">{item[key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        );
    
        const reportComponents = {
            'camper-demographics': (
                <div>
                    <h4 className="text-lg font-semibold mb-2">Camper Demographics Report</h4>
                    <p className="mb-4">This report shows the demographic distribution of campers by gender, providing insights into the gender composition of the camper population.</p>
                    <table className="min-w-full bg-white">
                        {renderTableHeaders(tableHeaders['camper-demographics'])}
                        {renderTableRows(reportData, ['gender', 'count'])}
                    </table>
                </div>
            ),
            'activity-participation': (
                <div>
                    <h4 className="text-lg font-semibold mb-2">Activity Participation Report</h4>
                    <p className="mb-4">This report provides details on the number of participants in each activity, helping to identify popular and less popular activities.</p>
                    <table className="min-w-full bg-white">
                        {renderTableHeaders(tableHeaders['activity-participation'])}
                        {renderTableRows(reportData, ['activity_name', 'participants'])}
                    </table>
                </div>
            ),
            'payment-status': (
                <div>
                    <h4 className="text-lg font-semibold mb-2">Payment Status Report</h4>
                    <p className="mb-4">This report shows the distribution of payment statuses among campers, highlighting the financial standing and payment completion rates.</p>
                    <table className="min-w-full bg-white">
                        {renderTableHeaders(tableHeaders['payment-status'])}
                        {renderTableRows(reportData, ['payment_status', 'count'])}
                    </table>
                </div>
            ),
            'age-distribution': (
                <div>
                    <h4 className="text-lg font-semibold mb-2">Age Distribution Report</h4>
                    <p className="mb-4">This report shows the age distribution of campers, providing insights into the age demographics of the camp attendees.</p>
                    <table className="min-w-full bg-white">
                        {renderTableHeaders(tableHeaders['age-distribution'])}
                        {renderTableRows(reportData, ['age_range', 'count'])}
                    </table>
                </div>
            ),
            'activity-preferences': (
                <div>
                    <h4 className="text-lg font-semibold mb-2">Activity Preferences Report</h4>
                    <p className="mb-4">This report shows the preferred activities of campers, helping to tailor camp programs to better match camper interests.</p>
                    <table className="min-w-full bg-white">
                        {renderTableHeaders(tableHeaders['activity-preferences'])}
                        {renderTableRows(reportData, ['activity', 'count'])}
                    </table>
                </div>
            ),
            'camp-attendance': (
                <div>
                    <h4 className="text-lg font-semibold mb-2">Camp Attendance Report</h4>
                    <p className="mb-4">This report tracks the attendance of campers at different camps, showing trends in participation across different camps and dates.</p>
                    <table className="min-w-full bg-white">
                        {renderTableHeaders(tableHeaders['camp-attendance'])}
                        {renderTableRows(reportData, ['camp', 'attendees'])}
                    </table>
                </div>
            ),
            'group-participation': (
                <div>
                    <h4 className="text-lg font-semibold mb-2">Group Participation Report</h4>
                    <p className="mb-4">This report provides details on the number of groups and group sizes participating in different camps.</p>
                    <table className="min-w-full bg-white">
                        {renderTableHeaders(tableHeaders['group-participation'])}
                        {renderTableRows(reportData, ['group', 'size'])}
                    </table>
                </div>
            ),
            'accommodation-usage': (
                <div>
                    <h4 className="text-lg font-semibold mb-2">Accommodation Usage Report</h4>
                    <p className="mb-4">This report shows the usage of different types of accommodations (tents, cabins), helping to manage and allocate accommodation resources efficiently.</p>
                    <table className="min-w-full bg-white">
                        {renderTableHeaders(tableHeaders['accommodation-usage'])}
                        {renderTableRows(reportData, ['type', 'usage'])}
                    </table>
                </div>
            ),
            'payment-summary': (
                <div>
                    <h4 className="text-lg font-semibold mb-2">Payment Summary Report</h4>
                    <p className="mb-4">This report provides a summary of payments, including the status (paid, unpaid, due) and types of payments (card, bank), helping manage camp finances.</p>
                    <table className="min-w-full bg-white">
                        {renderTableHeaders(tableHeaders['payment-summary'])}
                        {renderTableRows(reportData, ['status', 'count', 'amount'])}
                    </table>
                </div>
            ),
            'discount-usage': (
                <div>
                    <h4 className="text-lg font-semibold mb-2">Discount Usage Report</h4>
                    <p className="mb-4">This report details the usage of discounts across different camps, providing insights into the effectiveness of discount programs.</p>
                    <table className="min-w-full bg-white">
                        {renderTableHeaders(tableHeaders['discount-usage'])}
                        {renderTableRows(reportData, ['discount_type', 'usage'])}
                    </table>
                </div>
            ),
        };
    
        return reportComponents[currentReport] || null;
    };
    return (
<div className="main-content mx-auto p-4 bg-gray-50 min-h-screen flex">
    <div className="w-1/4 pr-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Report Generation</h2>
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Available Reports</h3>
            <ul className="space-y-2">
                <li>
                    <button 
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200" 
                        onClick={() => fetchReport('camper-demographics')}
                    >
                        Camper Demographics
                    </button>
                </li>
                <li>
                    <button 
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200" 
                        onClick={() => fetchReport('activity-participation')}
                    >
                        Activity Participation
                    </button>
                </li>
                <li>
                    <button 
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200" 
                        onClick={() => fetchReport('payment-status')}
                    >
                        Payment Status
                    </button>
                </li>
                <li>
                    <button 
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200" 
                        onClick={() => fetchReport('age-distribution')}
                    >
                        Age Distribution
                    </button>
                </li>
                <li>
                    <button 
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200" 
                        onClick={() => fetchReport('camp-attendance')}
                    >
                        Camp Attendance
                    </button>
                </li>
                <li>
                    <button 
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200" 
                        onClick={() => fetchReport('group-participation')}
                    >
                        Group Participation
                    </button>
                </li>
                <li>
                    <button 
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200" 
                        onClick={() => fetchReport('accommodation-usage')}
                    >
                        Accommodation Usage
                    </button>
                </li>
                <li>
                    <button 
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200" 
                        onClick={() => fetchReport('payment-summary')}
                    >
                        Payment Summary
                    </button>
                </li>
                <li>
                    <button 
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200" 
                        onClick={() => fetchReport('discount-usage')}
                    >
                        Discount Usage
                    </button>
                </li>
            </ul>
        </div>
    </div>
    <div className="w-3/4">
        <h3 className="text-xl font-semibold mb-4">Report Data</h3>
        <div className="bg-white p-6 rounded shadow-md">
            {renderReportData()}
        </div>
    </div>
</div>

    );
};

export default ReportGeneration;
