export enum InputTypes{
    TEXT = 0,
    MULTILINE_TEXT = 1,
    NUMBER = 2,
    DROPDOWN_LIST = 3,
    CHECKBOX_LIST = 4,
    BOOL =  5,
    IMAGES = 6
}

export type ListingModel = {
    inputName: String,
    inputValue: String,
    inputType: InputTypes,
    inputList?: Array<any>,
    required: boolean,
    serchable : boolean
}