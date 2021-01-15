export class InputModel{
    name: string;
    value: string;
    type: string;
    list: Array<string>;
    required: boolean;
    searchable: boolean;

    constructor(inputName, inputValue, inputType, required, searchable, inputList?){
        this.name = inputName;
        this.list = inputList;
        this.type = inputType;
        this.value = inputValue;
        this.required = required;
        this.searchable =searchable;
    }
}