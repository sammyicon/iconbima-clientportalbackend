

import {Router} from 'express'
import { MarinePolicyService } from '../controllers/marinePolicy/marine-policy.controller.js'

const marineRouter = Router()


marineRouter.get("/trade-types",(req,res)=>{
    return MarinePolicyService.getTradeTypes(req,res)
})

marineRouter.get("/shipping-methods",(req,res)=>{
    return MarinePolicyService.getShippingMethods(req,res)
})


marineRouter.get("/countries",(req,res)=>{
    return MarinePolicyService.getCountries(req,res)
})

marineRouter.get("/country-ports",(req,res)=>{
    return MarinePolicyService.getCountryPorts(req,res)
})


export default marineRouter