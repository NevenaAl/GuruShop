import { ListingModel } from '../models/Listing';
import {CarCreateListingInput} from './../models/Car';

const CreateListingInputs = [
    { identifier: 'car_inputs', inputs: CarCreateListingInput}
];

let inputResults: Array<ListingModel[]> = [];

export const resolveCreateListingInputs  = async (inputs:string[])=>{
    inputResults =[];
    await CreateListingInputs.map(input=>{
        inputs.forEach(element => {
            if(input.identifier===element){
                inputResults.push(input.inputs);
            }
        });
      
    });
    return inputResults.length!=0? JSON.stringify(inputResults[0]) : null;
};

