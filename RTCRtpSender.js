import {NativeModules} from 'react-native';
import RTCRtpTransceiver from './RTCRtpTransceiver';

const {WebRTCModule} = NativeModules;

export default class RTCRtpSender {
    _transceiver: RTCRtpTransceiver;
    _parameters: RTCRtpSendParameters = {};
    _mergeState: Function;

    track: MediaStreamTrack;

    constructor(_transceiver: RTCRtpTransceiver, track: MediaStreamTrack | null, mergeState: Function) {
        this._transceiver = _transceiver;
        this._mergeState = mergeState;
        this.track = track;
    }

    replaceTrack = (track: MediaStreamTrack | null) => {
        return new Promise((resolve, reject) => {
            WebRTCModule.peerConnectionTransceiverReplaceTrack(this._transceiver._peerConnectionId, this._transceiver.id, track ? track.id : null, (successful, data) => {
                if (successful) {
                    this._transceiver._mergeState(data.state);
                    resolve();
                } else {
                    reject(new Error(data));
                }
            });
        });
    }

    setParameters = (params: RTCRtpSendParameters) => {
        this._parameters = params
        console.log('setting rtpsender parameters: ', params)
        return new Promise((resolve, reject) => {
            WebRTCModule.peerConnectionTransceiverSetSenderParameters(this._transceiver._peerConnectionId, this._transceiver.id, {...params}, (successful, data) => {
                if (successful) {
                    this._transceiver._mergeState(data.state);
                    resolve();
                } else {
                    reject(new Error(data));
                }
            });
        });
    }

    getParameters = () => RTCRtpSendParameters => {
        return this._parameters
    }


}