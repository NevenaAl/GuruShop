export class InputModel{
    name: String;
    value: String;
    type: String;
    list: Array<String>;
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