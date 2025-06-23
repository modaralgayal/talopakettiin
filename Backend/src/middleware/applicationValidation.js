import { body } from 'express-validator';

export const applicationValidation = [
  // Basic Info
  body('applicationName').isString().trim().notEmpty().withMessage('Application name is required'),
  body('city').isString().trim().notEmpty().withMessage('City is required'),
  body('province').isString().trim().notEmpty().withMessage('Province is required'),
  body('budget').isString().trim().notEmpty().withMessage('Budget is required'),
  body('houseSize').isString().trim().notEmpty().withMessage('House size is required'),
  body('houseType').isString().trim().notEmpty().withMessage('House type is required'),
  body('delivery').isString().trim().notEmpty().withMessage('Delivery is required'),
  body('stories').isString().trim().notEmpty().withMessage('Stories is required'),
  body('bedrooms').isString().trim().notEmpty().withMessage('Bedrooms is required'),
  body('utilityRoom').isString().trim().notEmpty().withMessage('Utility room is required'),
  body('utilityRoomDetails').optional().isString(),
  body('mudroom').isString().trim().notEmpty().withMessage('Mudroom is required'),
  body('mudroomDetails').optional().isString(),
  body('terrace').isString().trim().notEmpty().withMessage('Terrace is required'),
  body('terraceDetails').optional().isString(),
  body('carport').isString().trim().notEmpty().withMessage('Carport is required'),
  body('carportDetails').optional().isString(),
  body('garage').isString().trim().notEmpty().withMessage('Garage is required'),
  body('garageDetails').optional().isString(),

  // Exterior
  body('houseMaterial').isString().trim().notEmpty().withMessage('House material is required'),
  body('houseMaterialOther').optional().isString(),
  body('roof').isString().trim().notEmpty().withMessage('Roof is required'),
  body('roofType').isString().trim().notEmpty().withMessage('Roof type is required'),
  body('roofOther').optional().isString(),
  body('houseShape').isString().trim().notEmpty().withMessage('House shape is required'),
  body('houseStyle').isString().trim().notEmpty().withMessage('House style is required'),

  // Interior
  body('floor').isString().trim().notEmpty().withMessage('Floor is required'),
  body('floorDetails').optional().isString(),
  body('interiorWalls').isString().trim().notEmpty().withMessage('Interior walls is required'),
  body('interiorWallsDetails').optional().isString(),
  body('ceiling').isString().trim().notEmpty().withMessage('Ceiling is required'),
  body('ceilingDetails').optional().isString(),

  // Kitchen
  body('kitchenType').isString().trim().notEmpty().withMessage('Kitchen type is required'),
  body('kitchenAccessories').optional().isArray(),

  // Heating
  body('heatingType').isArray().withMessage('Heating type is required'),
  body('heatingTypeOther').optional().isString(),
  body('heatingMethod').isArray().withMessage('Heating method must be an array'),
  body('heatingMethodOther').optional().isString(),
  body('directElectricHeating').optional().isString(),
  body('fireplace').optional().isString(),
  body('fireplaceHeatStorage').optional().isString(),
  body('bakingOven').optional().isString(),
  body('bakingOvenDetails').optional().isString(),
  body('otherInfoIndoor').optional().isString(),

  // Technical
  body('interestedIn').isArray().withMessage('InterestedIn must be an array'),
  body('interestedInOther').optional().isString(),
  body('wantsInOffer').isArray().withMessage('WantsInOffer must be an array'),
  body('wantsInOfferOther').optional().isString(),

  // Personal Info
  body('customerStatus').isString().trim().notEmpty().withMessage('Customer status is required'),
  body('hasPlot').isString().trim().notEmpty().withMessage('HasPlot is required'),
  body('fullName').isString().trim().notEmpty().withMessage('Full name is required'),
  body('phoneNumber').isString().trim().notEmpty().withMessage('Phone number is required'),
  body('additionalInfo').optional().isString(),
  body('privacyPolicy').isBoolean().withMessage('Privacy policy must be accepted'),
  // Attachments are handled by multer, not validated here
]; 