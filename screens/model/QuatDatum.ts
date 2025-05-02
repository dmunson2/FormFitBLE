import { Model } from "@nozbe/watermelondb";
import {field, text,date,readonly} from '@nozbe/watermelondb/decorators'

export default class QuatDatum extends Model {
    static table = 'quatData';

    @field('x') x:number;
    @field('y') y:number;
    @field('z') z:number;
    @field('w') w:number;
    @field('primary') primary:boolean;
    @readonly @date('created_at') createdAt:number;
}