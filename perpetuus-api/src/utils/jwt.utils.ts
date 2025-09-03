/**
 * Desencripta un JWT y retorna un JSON parseado
 *
 * @param {string} [token] El bearer token
 */
export function desencriptar_jwt(token: string) {
    try {
        let json_string = Buffer.from(token.split('.')[1], 'base64').toString();
        return JSON.parse(json_string);
    } catch (err) {
        throw `El token no es válido. Probablemente necesites iniciar sesión: ${err}`;
    }
}
