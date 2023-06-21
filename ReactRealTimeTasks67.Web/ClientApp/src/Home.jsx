import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "./Context";
import { HubConnectionBuilder } from "@microsoft/signalr";


const Home = () => {
    const { user } = useAuth()

    const connectionRef = useRef(null);
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ title: '' })

    useEffect(() => {

        const getTasks = async () => {
            const { data } = await axios.get('/api/task/gettasks')
            setTasks(data)
        }
        getTasks();

        const connectToHub = async () => {
            const connection = new HubConnectionBuilder().withUrl("/api/task").build();
            await connection.start();
            connectionRef.current = connection;

            connection.on("newTask", t => {
                setTasks(task => [...task, t])
            })
            connection.on("deleteTaskFromAll", taskId => {
            
                setTasks(oldList => oldList.filter(task => task.id != taskId))
              console.log(oldList)
            })
            connection.on("updateTaskForAll", updatedList => {
                setTasks(updatedList)
            })
        }
        connectToHub();


    }, [])

    const onAddClick = async () => {
        await axios.post('/api/task/addTask', task)
        setTask({ title: '' })
    }
    const onTextChange = e => {
        const copy = { ...task }
        copy[e.target.name] = e.target.value;
        setTask(copy)
    }
    const onUpdate = async (taskId) => {

        await axios.post('/api/task/updateTask', { taskId })
    }
    const onDelete = async (taskId) => {
        await axios.post('/api/task/deleteTask', { taskId })
    }



    return (
        <div className="container" style={{ marginTop: 80 }}>
            <div style={{ marginTop: 70 }}>
                <div className="row">
                    <div className="col-md-10">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Task Title"
                            value={task.title}
                            name="title"
                            onChange={onTextChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100" onClick={onAddClick}>Add Task</button>
                    </div>
                </div>
                <table className="table table-hover table-striped table-bordered mt-3">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(t => <tr>
                            <td>{t.title}</td>
                            <td>{!t.userId ?
                                <button className="btn btn-dark" onClick={() => onUpdate(t.id)}>I'm doing this one </button>
                                : t.userId == user.id ?
                                    <button className="btn btn-success" onClick={() => onDelete(t.id)} >I'm done</button>
                                    :
                                    <button className="btn btn-warning" disabled>{t.user.firstName} {t.user.lastName} is doing this one!</button>}
                            </td>
                        </tr>)}

                    </tbody>
                </table>
            </div>
        </div>

    )
}
export default Home;