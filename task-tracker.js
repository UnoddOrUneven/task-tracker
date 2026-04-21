class TaskTracker {

    constructor(tasks) {
        this.tasks = tasks;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(id) {
        id = parseInt(id,10);
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    createTask(description) {
        let _id = this._CreateTaskId()
        let _status = "todo"
        let _createdAt = Date.now();
        let _updatedAt = Date.now();
        return new Task(_id, description, _status, _createdAt, _updatedAt);
    }

    display(task) {
        console.log(`ID: ${task.id}, "${task.description}", status: ${task.status}, createdAt: ${task.createdAt}, updatedAt: ${task.updatedAt}`);
    }

    getNumberOfTasks() {
        return this.tasks.length -1;
    }
     _CreateTaskId() {
        if (this.tasks.length === 0) {
            return 0;
        }

        return this.tasks[this.getNumberOfTasks()].id + 1;
    }

    listTasks(...args) {
        if (args.includes("done")){return this.listDoneTasks()}
        if (args.includes("in-progress")){return this.listInProgressTasks()}
        if (args.includes("todo")){return this.listTodoTasks()}
        for (let task of this.tasks) {
            this.display(task);
        }
    }

    listDoneTasks(...args) {
        let doneTasks = this.tasks.filter((task) => task.status === "done");
        for (let task of doneTasks) {
            this.display(task);
        }
    }
    listInProgressTasks(...args) {
        let inProgressTasks = this.tasks.filter((task) => task.status === "in-progress");
        for (let task of inProgressTasks) {
            this.display(task);
        }
    }
    listTodoTasks(...args) {
        let todoTasks = this.tasks.filter((task) => task.status === "todo");
        for (let task of todoTasks) {
            this.display(task);
        }
    }

    markDoneTask(id) {
        id = parseInt(id,10);
        let task = this.tasks.find((task) => task.id === id);
        if (task) {
            task.status = "done";
            console.log(`Mark done task (ID: ${id})`);
        }
    }
    markInProgressTask(id)  {
        id = parseInt(id,10);
        let task = this.tasks.find((task) => task.id === id);
        if (task){
            task.status = "in-progress";
            console.log(`Mark in-progress task (ID: ${id})`);
        }

    }


}



class SaveManager{


    static save(TaskList){
        let json_tracker = JSON.stringify(taskTracker.tasks);
        const fs = require("fs")
        fs.writeFileSync(
            "task-tracker.json",json_tracker
        )
    }

    static load(){
        const fs = require("fs")
        const raw = fs.readFileSync("task-tracker.json").toString();
        if (raw.length === 0 ){return SaveManager.startFresh()}
        return JSON.parse(raw)
    }

    static startFresh(){
        console.log("Starting fresh list");
        return []
    }

}


class Task {

    constructor(id, description, status, createdAt, updatedAt) {
        this.id = id;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}
class CLI{

    static command_add(description, ...args) {
        let task = taskTracker.createTask(description);
        taskTracker.addTask(task);
        console.log(`Added task ${description} (ID: ${task.id})`);
    }

    static command_delete(id, ...args) {
        taskTracker.deleteTask(id, ...args);
        console.log(`Deleted task ${id}`);
    }

    static command_list(...args) {
        taskTracker.listTasks(...args);
    }
    static command_mark_done(id, ...args){
        taskTracker.markDoneTask(id, ...args)

    }
    static command_mark_in_progress(id, ...args) {
        taskTracker.markInProgressTask(id, ...args)
    }



}

let taskTracker = new TaskTracker(SaveManager.load());


const args = process.argv.slice(2)
const command = args[0]


let commands = {"add": CLI.command_add, "delete": CLI.command_delete ,"list": CLI.command_list, "mark-done": CLI.command_mark_done,
    "mark-in-progress": CLI.command_mark_in_progress}

commands[args[0]](...args.slice(1))
SaveManager.save(taskTracker.tasks);
