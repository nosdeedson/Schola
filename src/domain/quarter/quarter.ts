import { Rating } from "../rating/rating";
import { QuarterValidator } from "./quarter.validator";
import { Entity } from "../@shared/entity";

// equivalent to the school brazilian bimester
export class Quarter extends Entity {

    private _beginningDate: Date;
    private _endingDate: Date;
    private _currentQuarter: boolean;
    private _ratings?: Rating[];

    constructor(params: {
        currentQuarter: boolean,
        beginningDate: Date,
        endingDate: Date,
    }
    ) {
        super();
        this._currentQuarter = params.currentQuarter;
        this._beginningDate = params.beginningDate;
        this._endingDate = params.endingDate;
        this.validate();
    }

    get currentQuarter(): boolean {
        return this._currentQuarter
    }

    set currentQuarter(currentQuarter: boolean) {
        this._currentQuarter = currentQuarter;
    }

    get beginningDate(): Date {
        return this._beginningDate;
    }

    set beginningDate(date: Date) {
        this._beginningDate = date;
    }

    get endingDate(): Date {
        return this._endingDate;
    }

    set endingDate(date: Date) {
        this._endingDate = date;
    }

    get rating(): Rating[] {
        return this._ratings;
    }

    set rating(rating: Rating) {
        if (!this._ratings) {
            this._ratings = [];
        }
        this._ratings.push(rating);
    }

    validate() {
        new QuarterValidator().validate(this);
    }
}