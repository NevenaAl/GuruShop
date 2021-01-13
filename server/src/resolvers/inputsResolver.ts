import {ResolverMap} from './../handlers/resolver-map';
import {resolveCreateListingInputs} from '../handlers/inputsHandler';
import { gql } from 'apollo-server-express';

const InputsResolvers: ResolverMap= {
    Query:{
        "getAddListingInputs": async(_, {categoryInputId, subcategoryInputId} )=>{
            const inputs: string[] = [categoryInputId? categoryInputId: '', subcategoryInputId? subcategoryInputId: ''];
            const res = await resolveCreateListingInputs(inputs)
            return res? JSON.parse(res): null
        }
    }
}

export {InputsResolvers}