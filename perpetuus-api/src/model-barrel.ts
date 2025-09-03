/* THE ORDER OF THESE IMPORTS MATTERS A LOT */
import {
    HISTORY_LOG_MODEL,
    HistoryLog
} from './plugins/history/history-log.model';
import { User, USER_MODEL } from './componentes/usuario/usuario/usuario.model';
import {
    Rol,
    ROL_MODEL
} from './componentes/usuario/rol-usuario/rol-usuario.model';

const MODEL_IMPORTS_BARREL = {
    Rol,
    ROL_MODEL,
    HistoryLog,
    HISTORY_LOG_MODEL,
    User,
    USER_MODEL
};

export default MODEL_IMPORTS_BARREL;
