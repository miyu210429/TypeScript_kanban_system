console.log('コンパイル読み込み成功！');
import { bound } from "./decorator/bindThis.js";

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

new TaskForm();