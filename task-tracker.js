class TaskTracker {
    static idCounter = 0


    constructor(tasks) {
        this.tasks = tasks;
    }

    AddTask(description,...args) {
        let _id = TaskTracker._CreateTaskId()
        let _status = "todo"
        let _createdAt = Date.now();
        let _updatedAt = Date.now();

        let task = new Task(_id, description, _status, _createdAt, _updatedAt);
        this.tasks.push(task);

    }

    display(task) {
        console.log(`ID: ${task.id}, "${task.description}", status: ${task.status}, createdAt: ${task.createdAt}, updatedAt: ${task.updatedAt}`);
    }


    static _CreateTaskId() {
        this.idCounter += 1
        return this.idCounter
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
        taskTracker.AddTask(description, ...args);
        console.log(`Added task ${description}`);
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
