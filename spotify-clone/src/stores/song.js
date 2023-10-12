import { defineStore } from 'pinia'
import artist from '../artist.json'

export const useSongStore = defineStore('song', {
  state: () => ({
    isPlaying: false,
    audio: null,
    currentArtist: null,
    currentTrack: null
  }),
  actions: {
    loadSong(artist, track) {
        this.currentArtist = artist
        this.currentTrack = track

        if (this.audio && this.audio.src) {
            this.audio.pause()
            this.isPlaying = false
            this.audio.src = ''
        }

        this.audio = new Audio()
        this.audio.src = track.path

        setTimeout(() => {
            this.isPlaying = true
            this.audio.play()
        }, 200)
    },

    playOrPauseSong() {
        if (this.audio.paused) {
            this.isPlaying = true
            this.audio.play()
        } else {
            this.isPlaying = false
            this.audio.pause()
        }
    },

    playOrPauseThisSong(artist, track) {
        if (!this.audio || !this.audio.src || (this.currentTrack.id !== track.id)) {
            this.loadSong(artist, track)
            return
        }

        this.playOrPauseSong()
    },

    playSpeechSong(track) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.start();
        const synth = window.speechSynthesis;
        const store = this;
        const musician = artist;
      
        // Define a map of spoken commands to song names
        const commandToSong = {
          'music play into you by ariana grande': 'Into You',
          'music play love me harder by ariana grande': 'Love Me Harder',
          'music play break free by ariana grande': 'Break Free',
          'music play bang bang by ariana grande': 'Bang Bang'
        };
      
        recognition.onstart = function () {
          console.log('Listening, please speak...');
        };
      
        recognition.onresult = function (event) {
          const transcript = event.results[0][0].transcript.toLowerCase();
          const songName = commandToSong[transcript];
      
          if (songName) {
            const song = musician.tracks.find((track) => track.name === songName);
            if (!store.audio || !store.audio.src || store.currentTrack.id !== song.id) {
              store.loadSong(musician, song);
              speak(`Playing ${song.name} - By Ariana Grande`);
            }
          }
        };
      
        function speak(text) {
          const utterance = new SpeechSynthesisUtterance(text);
          synth.speak(utterance);
        }
      },

    prevSong(currentTrack) {
        let track = artist.tracks[currentTrack.id - 2]
        this.loadSong(artist, track)
    },

    nextSong(currentTrack) {
        if (currentTrack.id === artist.tracks.length) {
            let track = artist.tracks[0]
            this.loadSong(artist, track)
        } else {
            let track = artist.tracks[currentTrack.id]
            this.loadSong(artist, track)
        }
    },

    playFromFirst() {
        this.resetState()
        let track = artist.tracks[0]
        this.loadSong(artist, track)
    },

    resetState() {
        this.isPlaying = false
        this.audio = null
        this.currentArtist = null
        this.currentTrack = null
    }
  },
  persist: true
})
