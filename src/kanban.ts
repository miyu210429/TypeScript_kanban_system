console.log('コンパイル読み込み成功！');
import { bound } from "./decorator/bindThis.js";

const TASK_STATUS = ["todo", "working", "done"] as const; 
type TaskStatus = (typeof TASK_STATUS)[number];

interface Task {
    title: string;
    description?: string;
}


abstract class UIComponent<T extends HTMLElement> {
    templateEl: HTMLTemplateElement;
    element: T;

    constructor(templateId: string) {
        this.templateEl = document.querySelector(templateId)!;
        const clone = this.templateEl.content.cloneNode(true) as DocumentFragment;
        this.element = clone.firstElementChild as T;
    }

    mount(selector: string) {
        const targetEl = document.querySelector(selector)!;
        targetEl.insertAdjacentElement("beforeend", this.element);
    }

    abstract setup(): void;
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

    private submitHandler(event: Event) {
        event.preventDefault();

        const task = this.makeNewTask();

        const item = new TaskItem('#task-item-template', task);
        item.mount("#todo");

        this.clearInputs();
    }

    private bindEvents() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
}

class TaskList extends UIComponent<HTMLDivElement> {
    
    constructor(private taskStatus: TaskStatus) {
        super('#task-list-template');
        this.setup();
    }

    setup() {
        this.element.querySelector('h2')!.textContent = `${this.taskStatus}`;
        this.element.querySelector('ul')!.id = `${this.taskStatus}`;
    }
}

interface ClickableElement{
    element: HTMLLIElement;
    clickHandler(event:MouseEvent) : void;
    bindEvents(): void;
}

class TaskItem extends UIComponent<HTMLLIElement> implements ClickableElement {
    task: Task;

    constructor(templateId: string, _task: Task) {
        super("#task-item-template");
        this.task = _task;
        this.setup();
        this.bindEvents();
    }

    setup() {
        this.element.querySelector('h2')!.textContent = `${this.task.title}`;
        this.element.querySelector('p')!.textContent = `${this.task.description || ''}`;
    }

    @bound
    clickHandler(): void {

        if (!this.element.parentElement) return;
    
        const currentListId = this.element.parentElement.id as TaskStatus;
        const taskStatusIdx = TASK_STATUS.indexOf(currentListId);
    
        if (taskStatusIdx === -1) {
          throw new Error(`タスクステータスが不正です。`);
        }
    
        const nextListId = TASK_STATUS[taskStatusIdx + 1];
    
        if (nextListId) {

          const nextListEl = document.getElementById(
            nextListId
          ) as HTMLUListElement;
          nextListEl.appendChild(this.element);
          return;
        }
    
        this.element.remove();
    }  

    bindEvents() {
        this.element.addEventListener('click', this.clickHandler);
    }
}

new TaskForm();

TASK_STATUS.forEach(status => {
    const taskList = new TaskList(status);
    taskList.mount('#container');
});