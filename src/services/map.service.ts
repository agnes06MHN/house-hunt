import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ILocation } from 'src/models/point.model';
import { IComputedPoints } from 'src/models/computed-points.model';

@Injectable()
export class MapService {
  constructor(private readonly prisma: PrismaService) {}

  async getCenteredPointFromAddresses(
    addresses: string[]
  ): Promise<IComputedPoints> {
    if (addresses.length === 1) {
      return {
        inputPoints: [],
        centeredPoint: await this.getPointFromAddress(addresses[0]),
      };
    }

    const points = await Promise.all(
      addresses.map((address) => this.getPointFromAddress(address))
    );
    return {
      inputPoints: points,
      centeredPoint: await this.computeNewCenteredPoint(points),
    };
  }

  private async getPointFromAddress(address: string): Promise<ILocation> {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
      {
        method: 'GET',
      }
    );
    const data = await response.json();
    const { lat: latitude, lng: longitude } = data.results[0].geometry.location;
    const zipCode = data.results[0].address_components.find((component) =>
      component.types.includes('postal_code')
    )?.long_name;

    return { latitude, longitude, zipCode };
  }

  private async computeNewCenteredPoint(
    points: ILocation[]
  ): Promise<ILocation> {
    const latitude = points.reduce((acc, point) => acc + point.latitude, 0);
    const longitude = points.reduce((acc, point) => acc + point.longitude, 0);
    const centeredLatitude = latitude / points.length;
    const centeredLongitude = longitude / points.length;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${centeredLatitude},${centeredLongitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
      {
        method: 'GET',
      }
    );
    const data = await response.json();
    const zipCode = data.results[0].address_components.find((component) =>
      component.types.includes('postal_code')
    )?.long_name;

    return {
      latitude: centeredLatitude,
      longitude: centeredLongitude,
      zipCode,
    };
  }
}
