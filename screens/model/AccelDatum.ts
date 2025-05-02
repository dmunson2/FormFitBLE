import { Model } from "@nozbe/watermelondb";
import {field, text,date,readonly} from '@nozbe/watermelondb/decorators'

export default class AccelDatum extends Model {
    static table = 'accelData';

    @field('x') x:number;
    @field('y') y:number;
    @field('z') z:number;
    @field('primary') primary:boolean;
    @readonly @date('created_at') createdAt:number;
}