import {InputTypes, ListingModel} from './Listing';
import { AdditionalEquipemnt, CarBody, FuelTypes} from './CarLists'

export const CarCreateListingInput: Array<ListingModel> = [
    {inputName: 'Karoserija', inputValue: 'Karoserija',inputType: InputTypes.DROPDOWN_LIST, inputList: CarBody, required: true,serchable:true },
    {inputName: 'Kubikaza', inputValue: 'Kubikaza',inputType: InputTypes.NUMBER, required: true, serchable:true },
    {inputName: 'Gorivo', inputValue: 'Gorivo',inputType: InputTypes.DROPDOWN_LIST, inputList: FuelTypes, required: true, serchable:true },
    {inputName: 'Dodatna oprema', inputValue: 'Dodatna oprema',inputType: InputTypes.CHECKBOX_LIST, inputList: AdditionalEquipemnt, required: true, serchable:true },

]