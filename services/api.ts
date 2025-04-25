import axios from 'axios';

import { EDJOHN_CONFIG } from './config/edjohnConfig';

export const fetchAllCourses = async (level: number, semester: number, department: string) => {
    const endpoint = `/api/course/getCoursesByLevelAndSemesterAndDepartment?level=${level}&semester=${semester}&department=${encodeURIComponent(department)}`;

    try {
        const response = await axios.get(`${EDJOHN_CONFIG.BASE_URL}${endpoint}`,
            // {
            //     headers: EDJOHN_CONFIG.headers,
            // }
        );

        return response.data.data;
    } catch (error) {
        console.error('Error fetching all courses:', error);
        throw error;
    }
}

export const fetchDepartments = async () => {
    const endpoint = `/api/Department/getAllDepartments`;

    try {
        const response = await axios.get(`${EDJOHN_CONFIG.BASE_URL}${endpoint}`);

        return response.data.departments;
    } catch (error) {
        console.error('Error fetching all courses:', error);
        throw error;
    }
}