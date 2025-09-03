// Kyostenas @ 2023-2025

const reset = '\x1b[0m';
const fore = {
    _black: '\x1b[0;30m',
    _red: '\x1b[0;31m',
    _green: '\x1b[0;32m',
    _yellow: '\x1b[0;33m',
    _blue: '\x1b[0;34m',
    _purple: '\x1b[0;35m',
    _cyan: '\x1b[0;36m',
    _white: '\x1b[0;37m',
    bold_black: '\x1b[1;30m',
    bold_red: '\x1b[1;31m',
    bold_green: '\x1b[1;32m',
    bold_yellow: '\x1b[1;33m',
    bold_blue: '\x1b[1;34m',
    bold_purple: '\x1b[1;35m',
    bold_cyan: '\x1b[1;36m',
    bold_white: '\x1b[1;37m',
    sub_black: '\x1b[4;30m',
    sub_red: '\x1b[4;31m',
    sub_green: '\x1b[4;32m',
    sub_yellow: '\x1b[4;33m',
    sub_blue: '\x1b[4;34m',
    sub_purple: '\x1b[4;35m',
    sub_cyan: '\x1b[4;36m',
    sub_white: '\x1b[4;37m',
    strong_black: '\x1b[0;90m',
    strong_red: '\x1b[0;91m',
    strong_green: '\x1b[0;92m',
    strong_yellow: '\x1b[0;93m',
    strong_blue: '\x1b[0;94m',
    strong_purple: '\x1b[0;95m',
    strong_cyan: '\x1b[0;96m',
    strong_white: '\x1b[0;97m',
    bold_strong_black: '\x1b[1;90m',
    bold_strong_red: '\x1b[1;91m',
    bold_strong_green: '\x1b[1;92m',
    bold_strong_yellow: '\x1b[1;93m',
    bold_strong_blue: '\x1b[1;94m',
    bold_strong_purple: '\x1b[1;95m',
    bold_strong_cyan: '\x1b[1;96m',
    bold_strong_white: '\x1b[1;97m'
};
const back = {
    _black: '\x1b[40m',
    _red: '\x1b[41m',
    _green: '\x1b[42m',
    _yellow: '\x1b[43m',
    _blue: '\x1b[44m',
    _purple: '\x1b[45m',
    _cyan: '\x1b[46m',
    _white: '\x1b[47m',
    strong_black: '\x1b[0;100m',
    strong_red: '\x1b[0;101m',
    strong_green: '\x1b[0;102m',
    strong_yellow: '\x1b[0;103m',
    strong_blue: '\x1b[0;104m',
    strong_purple: '\x1b[0;105m',
    strong_cyan: '\x1b[0;106m',
    strong_white: '\x1b[0;107m'
};

import path from 'path';
import {
    limpiar_codigos_ansi,
    partcion_arbitraria_arreglo
} from './general.utils';
import Module from 'module';
import {
    DEBUG_LOGS,
    SHOW_LOGS,
    SHOW_REQ_LOGS,
    SHOW_SYS_REGS
} from '../config/env/env.config';
import fs from 'fs';
import os from 'os';

const TAM_PRED_CONSOLA = 90;
// const TAM_CONSOLA: number = (process.stdout.columns ?? TAM_PRED_CONSOLA)
const TAM_MINIMO_CONTENIDO = 40;
const TIPOS_LOG: tipos_log = {
    error: {
        texto: 'ERROR  ',
        color_texto: fore.bold_white,
        color_atras: back._red,
        color_extra: fore.strong_red
    },
    peligro: {
        texto: 'DANGER ',
        color_texto: fore._yellow + fore.sub_yellow,
        color_atras: back._red,
        color_extra: fore._red
    },
    advertencia: {
        texto: 'WARN   ',
        color_texto: fore._black,
        color_atras: back._yellow,
        color_extra: fore.strong_yellow
    },
    info: {
        texto: 'INFO   ',
        color_texto: fore._white,
        color_atras: back._blue,
        color_extra: fore.strong_blue
    },
    notice: {
        texto: 'NOTICE ',
        color_texto: fore._white + fore.sub_white,
        color_atras: back._purple,
        color_extra: fore.strong_purple
    },
    success: {
        texto: 'SUCCESS',
        color_texto: fore._black,
        color_atras: back._green,
        color_extra: fore._green
    },
    ok: {
        texto: 'OK     ',
        color_texto: fore._green,
        color_atras: back._black,
        color_extra: fore._green
    },
    log: {
        texto: 'LOG    ',
        color_texto: fore._black,
        color_atras: back._white,
        color_extra: fore._white
    },
    debug: {
        texto: 'DEBUG  ',
        color_texto: fore._red,
        color_atras: back._white,
        color_extra: fore._white
    },
    request: {
        texto: 'REQUEST',
        color_texto: fore._black,
        color_atras: back._cyan,
        color_extra: fore.strong_cyan
    }
};

interface tipos_log {
    error: tipo_log;
    peligro: tipo_log;
    advertencia: tipo_log;
    info: tipo_log;
    notice: tipo_log;
    success: tipo_log;
    ok: tipo_log;
    log: tipo_log;
    debug: tipo_log;
    request: tipo_log;
}

interface tipo_log {
    texto: string;
    color_texto: string;
    color_atras: string;
    color_extra: string;
}

interface linea_log {
    fecha: seccion_log;
    tipo_log: seccion_log;
    tipo_req?: seccion_log;
    ubicacion: seccion_log;
    contenido: seccion_log;
}

interface seccion_log {
    texto_interior: string;
    inicio_contenedor?: string;
    final_contenedor?: string;
    tam_sin_color?: number;
    partes_seccion?: string[];
    color_bordes?: string;
    color_contenido?: string;
}

// (o==================================================================o)
//   UTILES PARA LOGS (INICIO)
//   solo usados aquí
// (o-----------------------------------------------------------\/-----o)

function formatear_ceros(numero: number, cantidad_ceros: number) {
    let tam = String(numero).length;
    if (tam < cantidad_ceros) {
        let ceros = '0'.repeat(cantidad_ceros - tam);
        return `${ceros}${numero}`;
    } else {
        return numero;
    }
}

function formatear_fecha_log() {
    let fecha = new Date();
    let dia_mes = formatear_ceros(fecha.getDate(), 2);
    let mes = formatear_ceros(fecha.getMonth(), 2);
    let year = fecha.getFullYear();
    let hora = formatear_ceros(fecha.getHours(), 2);
    let minutos = formatear_ceros(fecha.getMinutes(), 2);
    let segundos = formatear_ceros(fecha.getSeconds(), 2);
    let hora_formateada = `${hora}:${minutos}:${segundos}`;
    let fecha_formateada = `${year}/${mes}/${dia_mes} ${hora_formateada}`;
    return fecha_formateada;
}

function obtener_nombre_archivo_origen(origen: string) {
    return path.basename(origen, path.extname(origen));
}

function ajustar_contenido_a_consola(
    request: string,
    tipo: tipo_log,
    contenido: string,
    ubicacion: string,
    fecha: string
) {
    let tam_partes = 0;
    let tam_traza_sin_color = 0;
    let tam_linea_total_sin_color = 0;
    let traza = '';
    let solo_contenido = '';
    let linea_total = '';
    if (request !== '') {
        traza = `${fecha} [${tipo.texto}] (${request}) (${ubicacion})`;
    } else {
        traza = `${fecha} [${tipo.texto}] (${ubicacion}) `;
    }
    solo_contenido = contenido;
    tam_traza_sin_color = traza.length;
    linea_total = traza + solo_contenido;
    tam_linea_total_sin_color = linea_total.length;
    let tam_consola = process.stdout.columns ?? TAM_PRED_CONSOLA;
    tam_partes = tam_consola - tam_traza_sin_color;

    let partes_contenido: string[] = [];
    if (
        tam_linea_total_sin_color > tam_consola &&
        tam_partes > TAM_MINIMO_CONTENIDO
    ) {
        let partes_particion = [];
        let a_reducir = tam_linea_total_sin_color - tam_consola;
        let contador_tam_restante_contenido = solo_contenido.length;
        while (
            a_reducir > 0 &&
            contador_tam_restante_contenido > TAM_MINIMO_CONTENIDO
        ) {
            partes_particion.push(tam_partes);
            a_reducir -= tam_partes;
            contador_tam_restante_contenido -= tam_partes;
        }
        partes_particion.push(contador_tam_restante_contenido);
        let partes_obtenidas = partcion_arbitraria_arreglo(
            solo_contenido.split(''),
            partes_particion
        );
        partes_contenido = partes_obtenidas.map((una_parte) =>
            una_parte.join('')
        );
    } else {
        partes_contenido = [solo_contenido];
    }
    return partes_contenido;
}

// (o-----------------------------------------------------------/\-----o)
//   UTILES PARA LOGS (FIN)
// (o==================================================================o)

function estructurar_log(
    tipo: tipo_log,
    ubicacion: string,
    contenido: string,
    request: string = ''
) {
    let fecha = formatear_fecha_log();
    let partes = contenido.split('\n');
    let partes_contenido: string[] = [];
    partes.map((una_parte_multilinea) => {
        let sub_partes = ajustar_contenido_a_consola(
            request,
            tipo,
            una_parte_multilinea,
            ubicacion,
            fecha
        );
        partes_contenido = [...partes_contenido, ...sub_partes];
    });

    let log: linea_log = {
        fecha: {
            texto_interior: fecha,
            color_contenido: ''
        },
        tipo_log: {
            texto_interior: tipo.texto,
            color_contenido: tipo.color_texto + tipo.color_atras,
            color_bordes: tipo.color_texto + tipo.color_atras,
            inicio_contenedor: '[',
            final_contenedor: ']'
        },
        ubicacion: {
            texto_interior: ubicacion,
            color_contenido: tipo.color_extra,
            inicio_contenedor: '(',
            final_contenedor: ')'
        },
        contenido: {
            texto_interior: contenido,
            partes_seccion: partes_contenido,
            color_contenido: tipo.color_extra
        }
    };
    if (request) {
        log.tipo_req = {
            texto_interior: request,
            color_contenido: tipo.color_extra,
            inicio_contenedor: '(',
            final_contenedor: ')'
        };
    }
    return log;
}

function imprimir(estructura: linea_log) {
    let partes_posteriores = [];

    let fecha = `${estructura.fecha.texto_interior} `;
    partes_posteriores.push(fecha);

    let tipo_log = estructura.tipo_log;
    let borde_izquierda_tipo = `${tipo_log.color_bordes}${tipo_log.inicio_contenedor}${reset}`;
    let borde_derecha_tipo = `${tipo_log.color_bordes}${tipo_log.final_contenedor}${reset}`;
    let tipo = `${tipo_log.color_contenido}${tipo_log.texto_interior}${reset}`;
    let tipo_formado = `${borde_izquierda_tipo}${tipo}${borde_derecha_tipo} `;
    partes_posteriores.push(tipo_formado);

    if (estructura.tipo_req) {
        let tipo_req = estructura.tipo_req;
        let borde_izquierda_tipo_req = tipo_req.inicio_contenedor;
        let borde_derecha_tipo_req = tipo_req.final_contenedor;
        let texto_tipo_req = `${tipo_req.color_contenido}${tipo_req.texto_interior}${reset}`;
        let tipo_req_formado = `${borde_izquierda_tipo_req}${texto_tipo_req}${borde_derecha_tipo_req} `;
        partes_posteriores.push(tipo_req_formado);
    }

    let ubicacion = estructura.ubicacion;
    let borde_izquierda_ubic = ubicacion.inicio_contenedor;
    let borde_derecha_ubic = ubicacion.final_contenedor;
    let texto_ubicacion = `${ubicacion.color_contenido}${ubicacion.texto_interior}${reset}`;
    let ubic_formada = `${borde_izquierda_ubic}${texto_ubicacion}${borde_derecha_ubic} `;
    partes_posteriores.push(ubic_formada);

    let partes_posteriores_formadas = partes_posteriores.join('');
    estructura.contenido.partes_seccion?.map((una_parte) => {
        let parte_color = `${estructura.contenido.color_contenido}${una_parte}${reset}`;
        console.log(partes_posteriores_formadas + parte_color);
        save_log_on_file(partes_posteriores_formadas + parte_color);
    });
}

async function print_log(estructura: linea_log) {
    if (SHOW_LOGS) imprimir(estructura);
}

async function print_sys_reg(estructura: linea_log) {
    if (SHOW_SYS_REGS) imprimir(estructura);
}

async function print_req_log(estructura: linea_log) {
    if (SHOW_REQ_LOGS) imprimir(estructura);
}

async function print_debug_log(estructura: linea_log) {
    if (DEBUG_LOGS) imprimir(estructura);
}

const LOG_PATH = path.join(
    os.tmpdir(),
    'perpetuus',
    'logs',
    'request_logs.txt'
);
fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
const LOG_STREAM = fs.createWriteStream(LOG_PATH, { flags: 'a' });
async function save_log_on_file(texto: string) {
    const CLEANSED_TEXT = limpiar_codigos_ansi(texto);
    LOG_STREAM.write(CLEANSED_TEXT.nueva_cadena + '\n');
}

function formatear_contenido(...contenido: any) {
    return contenido
        .map(function (un_objeto: any) {
            return String(un_objeto);
        })
        .join(' ');
}

export const syslog = (modulo: Module) => {
    let ubicacion!: string;
    let ubicacion_manual: boolean = false;
    function crear_log(
        funcion: Function,
        tipo: tipo_log,
        request: string | undefined,
        ...contenido: any
    ) {
        contenido = formatear_contenido(...contenido);
        if (!ubicacion_manual)
            ubicacion = obtener_nombre_archivo_origen(modulo.filename);
        else ubicacion = obtener_nombre_archivo_origen(ubicacion);
        let estructura = estructurar_log(tipo, ubicacion, contenido, request);
        funcion(estructura);
        ubicacion_manual = false;
    }
    let funciones = {
        definir_ubicacion: function (ubicacion_nueva: string) {
            ubicacion = ubicacion_nueva;
            ubicacion_manual = true;
        },
        debug: async (...contenido: any) => {
            crear_log(
                print_debug_log,
                TIPOS_LOG.debug,
                undefined,
                ...contenido
            );
        },
        log: async (...contenido: any) => {
            crear_log(print_log, TIPOS_LOG.log, undefined, ...contenido);
        },
        info: async (...contenido: any) => {
            crear_log(print_sys_reg, TIPOS_LOG.info, undefined, ...contenido);
        },
        notice: async (...contenido: any) => {
            crear_log(print_sys_reg, TIPOS_LOG.notice, undefined, ...contenido);
        },
        warning: async (...contenido: any) => {
            crear_log(
                print_sys_reg,
                TIPOS_LOG.advertencia,
                undefined,
                ...contenido
            );
        },
        danger: async (...contenido: any) => {
            crear_log(
                print_sys_reg,
                TIPOS_LOG.peligro,
                undefined,
                ...contenido
            );
        },
        error: async (...contenido: any) => {
            crear_log(print_sys_reg, TIPOS_LOG.error, undefined, ...contenido);
        },
        success: async (...contenido: any) => {
            crear_log(
                print_sys_reg,
                TIPOS_LOG.success,
                undefined,
                ...contenido
            );
        },
        ok: async (...contenido: any) => {
            crear_log(print_sys_reg, TIPOS_LOG.ok, undefined, ...contenido);
        },
        _Request: async (request: string, ...contenido: any) => {
            crear_log(print_req_log, TIPOS_LOG.request, request, ...contenido);
        }
    };
    return funciones;
};

process.on('SIGINT', () => {
    LOG_STREAM.end();
    process.exit();
});
