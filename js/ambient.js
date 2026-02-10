// Ambient Sound Analyzer for PathGuardian
// Uses Web Audio API to analyze microphone input and classify environment

class AmbientSoundAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.stream = null;
        this.isListening = false;
        this.callbacks = [];
        this.intervalId = null;

        // Environment profiles based on audio characteristics
        this.environments = [
            {
                name: 'Quiet Park',
                icon: '🌳',
                color: '#10B981',
                desc: 'Near trees, low ambient noise',
                minDb: 0, maxDb: 30,
                freqProfile: 'low'  // nature = low frequency dominant
            },
            {
                name: 'Residential Street',
                icon: '🏘️',
                color: '#6366F1',
                desc: 'Calm neighborhood, light activity',
                minDb: 30, maxDb: 45,
                freqProfile: 'balanced'
            },
            {
                name: 'Busy Street',
                icon: '🚗',
                color: '#F59E0B',
                desc: 'Traffic and pedestrian sounds',
                minDb: 45, maxDb: 60,
                freqProfile: 'mid'
            },
            {
                name: 'Shopping Area',
                icon: '🛍️',
                color: '#EC4899',
                desc: 'Crowds, music, and chatter',
                minDb: 55, maxDb: 70,
                freqProfile: 'high'
            },
            {
                name: 'Loud / Indoor Mall',
                icon: '🏬',
                color: '#EF4444',
                desc: 'High noise, echoes, many voices',
                minDb: 65, maxDb: 100,
                freqProfile: 'high'
            }
        ];
    }

    async start() {
        try {
            // Request microphone access
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = this.audioContext.createMediaStreamSource(this.stream);

            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            source.connect(this.analyser);

            this.isListening = true;

            // Analyze every 2 seconds
            this.intervalId = setInterval(() => this.analyze(), 2000);
            // Do an immediate first analysis
            setTimeout(() => this.analyze(), 500);

            return true;
        } catch (err) {
            console.error('Microphone access denied:', err);
            return false;
        }
    }

    stop() {
        this.isListening = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    analyze() {
        if (!this.analyser || !this.isListening) return;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);

        // Calculate overall volume (RMS of frequency magnitudes)
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / bufferLength);

        // Convert to approximate dB scale (0-100 range)
        const volumeDb = Math.min(100, Math.max(0, rms * 0.7));

        // Frequency band analysis
        const lowBand = this.avgRange(dataArray, 0, Math.floor(bufferLength * 0.2));
        const midBand = this.avgRange(dataArray, Math.floor(bufferLength * 0.2), Math.floor(bufferLength * 0.6));
        const highBand = this.avgRange(dataArray, Math.floor(bufferLength * 0.6), bufferLength);

        // Determine dominant frequency band
        let freqProfile = 'balanced';
        if (lowBand > midBand * 1.3 && lowBand > highBand * 1.3) {
            freqProfile = 'low';
        } else if (highBand > midBand * 1.1) {
            freqProfile = 'high';
        } else if (midBand > lowBand * 1.1) {
            freqProfile = 'mid';
        }

        // Match environment
        const env = this.classifyEnvironment(volumeDb, freqProfile);

        // Build visualization data (normalize to 0-1 for bar display)
        const maxVal = Math.max(...dataArray) || 1;
        const bars = [];
        const barCount = 16;
        const step = Math.floor(bufferLength / barCount);
        for (let i = 0; i < barCount; i++) {
            bars.push(dataArray[i * step] / maxVal);
        }

        const result = {
            volumeDb: Math.round(volumeDb),
            freqProfile,
            lowBand: Math.round(lowBand),
            midBand: Math.round(midBand),
            highBand: Math.round(highBand),
            environment: env,
            bars
        };

        this.callbacks.forEach(cb => cb(result));
    }

    avgRange(arr, start, end) {
        let sum = 0;
        for (let i = start; i < end; i++) sum += arr[i];
        return sum / (end - start);
    }

    classifyEnvironment(db, freqProfile) {
        // Find best matching environment based on volume
        let best = this.environments[0];
        for (const env of this.environments) {
            if (db >= env.minDb && db <= env.maxDb) {
                // Prefer environments with matching frequency profile
                if (env.freqProfile === freqProfile) {
                    return env;
                }
                best = env;
            }
        }
        return best;
    }

    onUpdate(callback) {
        this.callbacks.push(callback);
    }
}

// Global instance
window.ambientAnalyzer = new AmbientSoundAnalyzer();
