console.log('コンパイル読み込み成功！');
import { bound } from "./decorator/bindThis.js";

const TASK_STATUS = ["todo", "working", "done"] as const; 
type TaskStatus = (typeof TASK_STATUS)[number];

interface Task {
    title: string;
    description?: string;
}



class TaskForm {
    element: HTMLFormElement;
    titleInputEl: HTMLInputElement;
    descriptionInputEl: HTMLTextAreaElement;

    constructor(){
        this.element = document.querySelector('#task-form')!;
        this.titleInputEl = document.querySelector('#form-title')!;
        this.descriptionInputEl = document.querySelector('#form-description')!;

        this.bindEvents();
    }

    private makeNewTask(): Task {
        return {
            title: this.titleInputEl.value,
            description: this.descriptionInputEl.value,
        };
    }

    private clearInputs(): void {
        this.titleInputEl.value = '';
        this.descriptionInputEl.value = '';
    }

    @bound
    private submitHandler(event: Event) {
        event.preventDefault();

        console.log(this.titleInputEl.value);
        console.log(this.descriptionInputEl.value);

        this.clearInputs();
    }

    private bindEvents() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
}

class TaskList {
    templateEl: HTMLTemplateElement;
    element: HTMLDivElement;
    private taskStatus: TaskStatus;

    constructor(templateId: string, _taskStatus: TaskStatus) {
        this.templateEl = document.querySelector(templateId)!;
        const clone = this.templateEl.content.cloneNode(true) as DocumentFragment;
        this.element = clone.firstElementChild as HTMLDivElement;
        this.taskStatus = _taskStatus;

        this.setup();
    }

    setup() {
        this.element.querySelector('h2')!.textContent = `${this.taskStatus}`;
        this.element.querySelector('ul')!.id = `${this.taskStatus}`;
    }
}

new TaskForm();