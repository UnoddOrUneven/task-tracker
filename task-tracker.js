class TaskTracker {

    constructor(tasks) {
        this.tasks = tasks;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(id) {
        id = parseInt(id,10);
        let task = this.tasks.find((task) => task.id === id);
        if (!task) {
            console.log(`Task with ID ${id} not found!`);
            return;
        }
        let index = this.tasks.indexOf(task);
        this.tasks.splice(index,1)
        console.log(`Task with ID ${id} deleted!`);
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
        let json_tracker = JSON.stringify(TaskList);
        const fs = require("fs")
        fs.writeFileSync(
            "task-tracker.json",json_tracker
        )
    }

    static load(){
        const fs = require("fs")
        if (!fs.existsSync("task-tracker.json")) {return SaveManager.startFresh()}
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
    constructor(taskTracker){
        this.taskTracker = taskTracker;
        this.commands = {"add": this.command_add.bind(this), "delete": this.command_delete.bind(this) ,"list": this.command_list.bind(this), "mark-done": this.command_mark_done.bind(this),
            "mark-in-progress": this.command_mark_in_progress.bind(this),"help":this.command_display_help.bind(this),}

        let args = process.argv.slice(2)

        if (!Object.keys(this.commands).includes(args[0])) {
            console.log(`${args[0]} is not a valid command`);
        return 0;
        }
        this.commands[args[0]](...args.slice(1))
    }



    command_display_help(...args) {
        console.log(`List tasks - list 
        Add task - add "description"
        Delete task - delete [ID] 
        Mark task done - mark-done [ID]
        Mark task in-progress - mark-in-progress [ID]
        Display this message - help`);



    }

    command_add(description, ...args) {
        let task = this.taskTracker.createTask(description);
        this.taskTracker.addTask(task);
        console.log(`Added task ${description} (ID: ${task.id})`);
    }

    command_delete(id, ...args) {
        this.taskTracker.deleteTask(id, ...args);

    }

    command_list(...args) {
        this.taskTracker.listTasks(...args);
    }
    command_mark_done(id, ...args){
        this.taskTracker.markDoneTask(id, ...args)

    }
    command_mark_in_progress(id, ...args) {
        this.taskTracker.markInProgressTask(id, ...args)
    }



}

let taskTracker = new TaskTracker(SaveManager.load());


const cli = new CLI(taskTracker);

SaveManager.save(taskTracker.tasks);
