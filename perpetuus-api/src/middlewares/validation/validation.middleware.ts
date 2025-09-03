import mongoose from 'mongoose';

function is_mongo_server_error(error: any) {
    return (
        error && error.name === 'MongooseServerError' && error.code === 11000
    );
}

export function process_unique_errors<T extends new (...args: any) => any>(
    error: mongoose.mongo.MongoServerError | Error | null,
    doc: InstanceType<T>,
    next: (err?: mongoose.CallbackError) => void,
    _this: InstanceType<T>
) {
    if (is_mongo_server_error(error)) {
        const MONGO_ERROR = error as mongoose.mongo.MongoServerError;
        const FIELD_NAME = Object.keys(MONGO_ERROR.keyPattern)[0];
        const FIELD_VALUE = MONGO_ERROR.keyValue[FIELD_NAME];
        const VALIDATION_ERROR = new mongoose.Error.ValidationError(_this);
        VALIDATION_ERROR.errors[FIELD_NAME] = new mongoose.Error.ValidatorError(
            {
                message: `${FIELD_NAME} "${FIELD_VALUE}" ya está ocupado`,
                type: 'unique',
                path: FIELD_NAME,
                value: FIELD_VALUE
            }
        );
        next(VALIDATION_ERROR);
    } else {
        next(error);
    }
}
