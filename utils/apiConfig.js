/**
 * Konfigurasi untuk request API Trading Economics
 */

// Gunakan dotenv untuk variabel lingkungan
require('dotenv').config();

// Headers yang diperlukan untuk autentikasi ke Trading Economics API
const getApiHeaders = () => {
  return {
    'Apikey': process.env.TE_APIKEY || 'android-key',
    'Player-Id': process.env.TE_PLAYER_ID || 'cQd9bH8UQ8Sv9TwoXX6IoT:APA91bGtiCi0aiQ2BKT3occwk4ABSvrNwFoXk-d_IwpVivK-xd5smAMEIT4gAZv_r_PcxWZObPExzlrYeF_0teU4SZSP3viOeBmNFg1yJZXjS0rn9dV76xU',
    'Authorization': process.env.TE_AUTHORIZATION || 'Client ec2251b8b2a04ae:4p3t4l6viufiz8e',
    'Player-Id-Type': process.env.TE_PLAYER_ID_TYPE || 'fcm',
    'App-Version': process.env.TE_APP_VERSION || '2.7.6',
    'Accept-Encoding': 'gzip, deflate, br',
    'User-Agent': 'okhttp/4.11.0'
  };
};

module.exports = {
  getApiHeaders
}; 