
import * as SQLite from 'expo-sqlite';

export interface VehicleBrand {
  id: number;
  name: string;
  type: 'car' | 'motorcycle' | 'truck' | 'agricultural';
}

export interface VehicleModel {
  id: number;
  brandId: number;
  name: string;
}

export interface VehicleYear {
  id: number;
  modelId: number;
  year: number;
}

export interface VehicleVersion {
  id: number;
  yearId: number;
  name: string;
}

export interface OilSpecification {
  id: number;
  versionId: number;
  component: 'engine' | 'gearbox' | 'differential';
  api?: string;
  acea?: string;
  dexos?: string;
  viscosity?: string;
  oem?: string;
  notes?: string;
}

// Mock database - In a real app, you would load the SQLite database
// For now, we'll use mock data
const mockBrands: VehicleBrand[] = [
  { id: 1, name: 'Toyota', type: 'car' },
  { id: 2, name: 'Honda', type: 'car' },
  { id: 3, name: 'Ford', type: 'car' },
  { id: 4, name: 'Chevrolet', type: 'car' },
  { id: 5, name: 'Volkswagen', type: 'car' },
  { id: 6, name: 'Yamaha', type: 'motorcycle' },
  { id: 7, name: 'Honda', type: 'motorcycle' },
  { id: 8, name: 'Volvo', type: 'truck' },
  { id: 9, name: 'John Deere', type: 'agricultural' },
];

const mockModels: VehicleModel[] = [
  { id: 1, brandId: 1, name: 'Corolla' },
  { id: 2, brandId: 1, name: 'Camry' },
  { id: 3, brandId: 1, name: 'RAV4' },
  { id: 4, brandId: 2, name: 'Civic' },
  { id: 5, brandId: 2, name: 'Accord' },
  { id: 6, brandId: 3, name: 'F-150' },
  { id: 7, brandId: 4, name: 'Silverado' },
  { id: 8, brandId: 5, name: 'Golf' },
];

const mockYears: VehicleYear[] = [
  { id: 1, modelId: 1, year: 2023 },
  { id: 2, modelId: 1, year: 2022 },
  { id: 3, modelId: 1, year: 2021 },
  { id: 4, modelId: 2, year: 2023 },
  { id: 5, modelId: 3, year: 2023 },
  { id: 6, modelId: 4, year: 2023 },
  { id: 7, modelId: 5, year: 2023 },
  { id: 8, modelId: 6, year: 2023 },
];

const mockVersions: VehicleVersion[] = [
  { id: 1, yearId: 1, name: 'XLE 2.0L' },
  { id: 2, yearId: 1, name: 'SE 1.8L' },
  { id: 3, yearId: 2, name: 'XLE 2.0L' },
  { id: 4, yearId: 4, name: 'SE 2.5L' },
  { id: 5, yearId: 5, name: 'Limited 2.5L' },
];

const mockOilSpecs: OilSpecification[] = [
  {
    id: 1,
    versionId: 1,
    component: 'engine',
    api: 'SN Plus',
    acea: 'A5/B5',
    viscosity: '0W-20',
    oem: 'Toyota Genuine',
    notes: 'Recommended for optimal fuel economy',
  },
  {
    id: 2,
    versionId: 1,
    component: 'gearbox',
    viscosity: 'ATF WS',
    oem: 'Toyota WS',
    notes: 'Use only Toyota WS fluid',
  },
  {
    id: 3,
    versionId: 1,
    component: 'differential',
    viscosity: '75W-85',
    api: 'GL-5',
    notes: 'Check level every 30,000 km',
  },
  {
    id: 4,
    versionId: 2,
    component: 'engine',
    api: 'SN',
    acea: 'A3/B4',
    viscosity: '5W-30',
    notes: 'Standard specification',
  },
];

export class DatabaseService {
  private static instance: DatabaseService;
  
  private constructor() {
    // Initialize database
    console.log('Database service initialized');
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async getBrands(): Promise<VehicleBrand[]> {
    // In a real app, query the SQLite database
    return mockBrands;
  }

  async getModelsByBrand(brandId: number): Promise<VehicleModel[]> {
    return mockModels.filter(model => model.brandId === brandId);
  }

  async getYearsByModel(modelId: number): Promise<VehicleYear[]> {
    return mockYears.filter(year => year.modelId === modelId);
  }

  async getVersionsByYear(yearId: number): Promise<VehicleVersion[]> {
    return mockVersions.filter(version => version.yearId === yearId);
  }

  async getOilSpecifications(versionId: number): Promise<OilSpecification[]> {
    return mockOilSpecs.filter(spec => spec.versionId === versionId);
  }

  async searchOilSpecs(
    brandId: number,
    modelId: number,
    yearId: number,
    versionId?: number
  ): Promise<OilSpecification[]> {
    // If version is specified, use it
    if (versionId) {
      return this.getOilSpecifications(versionId);
    }

    // Otherwise, get all versions for the year and return their specs
    const versions = await this.getVersionsByYear(yearId);
    const allSpecs: OilSpecification[] = [];
    
    for (const version of versions) {
      const specs = await this.getOilSpecifications(version.id);
      allSpecs.push(...specs);
    }

    return allSpecs;
  }
}
