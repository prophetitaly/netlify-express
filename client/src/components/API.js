import dayjs from 'dayjs'

const URL = "http://localhost:3000"

async function loadTasks() {
    const response = await fetch(URL + '/api/tasks/');
    if (response.ok) {
        const fetchedTasks = await response.json();
        fetchedTasks.forEach(e => {
            e.date = dayjs(e.date);
        });
        return fetchedTasks;
    }else return { 'err': 'Failed to load data from server' }
}

async function addTask(task) {
    const response = await fetch(URL + "/api/tasks/" + task.id,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });
    if (response.ok) {
        return null;
    } else return { 'err': 'Failed to store data on server' }
}


async function deleteTask(tId) {
    const response = await fetch(URL + "/api/tasks/delete/" + tId,
        {
            method: "DELETE"
        });
    if (response.ok) {
        return null;
    } else return { 'err': 'Failed to cancel task from server' }
}


const API = { loadTasks, addTask, deleteTask };
export default API;