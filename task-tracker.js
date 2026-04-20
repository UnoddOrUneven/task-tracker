class TaskTracker {
    static idCounter = 0


    constructor(tasks) {
        this.tasks = tasks;
    }

    addTask(task) {
        this.tasks.push(task);
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
        for (let task of this.tasks) {
            this.display(task);
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
    static command_list(description, ...args) {
        taskTracker.listTasks(...args);
    }

}

let taskTracker = new TaskTracker(SaveManager.load());


const args = process.argv.slice(2)
const command = args[0]


let commands = {"add": CLI.command_add, "list": CLI.command_list}

commands[args[0]](...args.slice(1))
SaveManager.save(taskTracker.TaskList);
