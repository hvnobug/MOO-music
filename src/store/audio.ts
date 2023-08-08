import type { Playlist } from '@/api/interface/Playlist'
import type { Song } from '@/components/Song/Song.vue'
import type { SongURL } from '@/api/interface/SongURL'
import { getSongURL } from '@/api/play'
import toast from '@/utils/toast'
import { transHTTPS } from '@/utils/util'

export interface SongInfo {
  song: Song
  urlInfo: SongURL
}

// * 懒加载：使用时再进行重写
/* const cacheStore: {value: ReturnType<typeof useCacheStore>} = {
  get value() {
    // @ts-ignore
    delete this.value
    return (this.value = useCacheStore())
  }
} */

const userStore: {value: ReturnType<typeof useUserStore>} = {
  get value() {
    // @ts-ignore
    delete this.value
    return (this.value = useUserStore())
  }
}

export const useAudioStore = defineStore('audio', () => {
  const audio = markRaw(uni.getBackgroundAudioManager?.() || uni.createInnerAudioContext())
  const isLoading = ref(false) // * 是否缓冲中
  const isPlay = ref(false)
  const duration = ref(0) // * 当前歌曲时长
  const currentTime = ref(0) // * 当前歌曲播放时间

  const playlist = shallowRef<Playlist>()
  const songs = shallowRef<Song[]>([])
  const currentSongInfo = shallowRef<SongInfo>()
  const currentSongIndex = ref(-1)

  function setPreSong() {
    if (!songs.value.length) return

    const last = songs.value.length - 1
    const currentIndex = currentSongIndex.value
    const preIndex = currentIndex === 0 ? last : currentIndex - 1
    setCurrentSong(songs.value[preIndex], preIndex)
  }

  function setNextSong() {
    if (!songs.value.length) return

    const last = songs.value.length - 1
    const currentIndex = currentSongIndex.value
    const nextIndex = currentIndex === last ? 0 : currentIndex + 1
    setCurrentSong(songs.value[nextIndex], nextIndex)
  }

  async function setCurrentSong(song: Song, index: number) {
    currentSongIndex.value = index

    // * 重复点击，重新播放
    if (currentSongInfo.value?.song.id === song.id && currentSongInfo.value.urlInfo.url) {
      return (audio.seek(0), audio.play())
    }

    try {
      isLoading.value = true
      const { data: [urlInfo] } = await getSongURL(song.id, userStore.value.profile ? 'lossless' : 'standard')
      console.log('🚀 ~ file: audio.ts:58 ~ setCurrentSong ~ urlInfo:', urlInfo)

      const oldSongInfo = currentSongInfo.value
      const newSongInfo = currentSongInfo.value = { song, urlInfo }
      // * 有 url 正常播放
      if (newSongInfo.urlInfo.url) return setBackgroundAudio(currentSongInfo.value)

      // * url为空自动下一首
      if (!oldSongInfo || oldSongInfo.urlInfo.url) return setNextSong()

      // ! 连续两次请求 url 都为空直接报错退出（避免无限循环下一首）
      throw new Error('播放地址失效')
    } catch (error) {
      audio.pause()
      console.error(error)
      isLoading.value = false
      isPlay.value = false
    }
  }

  function setBackgroundAudio({ song, urlInfo }: SongInfo) {
    audio.title = song.name
    audio.epname = song.al.name
    audio.singer = song.ar.reduce((acc, { name }) => (acc += name + '. '), '')
    audio.coverImgUrl = song.al.picUrl + '?param=500y500'
    audio.src = transHTTPS(urlInfo.url)

    // #ifdef H5
    // * 设置浏览器的音乐播放器信息   p.s: 就是插件栏右边的那个音乐按钮
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.name,
      artist: song.al.name,
      album: audio.epname,
      artwork: [{ src: song.al.picUrl + '?param=500y500', sizes: '500x500', type: 'image/png' }]
    })
    // #endif
  }

  function toggle() {
    if (currentSongInfo.value?.urlInfo.url) {
      isPlay.value ? audio.pause() : audio.play()
    }
  }

  return {
    audio,
    isLoading,
    isPlay,
    duration,
    currentTime,
    playlist,
    songs,
    currentSongInfo,
    currentSongIndex,
    setPreSong,
    setCurrentSong,
    setNextSong,
    toggle
  }
})

export function setupAudio() {
  const audioStore = useAudioStore()
  const { audio } = audioStore
  // @ts-ignore
  audio.autoplay = true

  audio.onCanplay(() => {
    audioStore.isLoading = false
    audioStore.duration = audioStore.currentSongInfo?.urlInfo.time! / 1000
    audio.play()
    console.log('onCanplay.duration: ', audioStore.duration)
  })

  audio.onPlay(() => {
    console.log('onPlay: ')
    audioStore.isPlay = true
  })

  audio.onPause(() => {
    console.log('onPause: ')
    audioStore.isPlay = false
  })

  audio.onEnded(() => {
    console.log('onEnded: ')
    audioStore.setNextSong()
  })

  audio.onTimeUpdate(() => {
    audioStore.currentTime = audio.currentTime
  })

  audio.onError((err) => {
    toast.fail('链接无效')
    console.error(err)

    audioStore.isLoading = false
    audioStore.isPlay = false
  })

  // #ifndef H5
  audio.onNext(() => {
    console.log('onNext: ')
    audioStore.setNextSong()
  })

  audio.onPrev(() => {
    console.log('onPrev: ')
    audioStore.setPreSong()
  })
  // #endif

  // #ifdef H5
  // * 监听浏览器的音乐播放器操作   p.s: 就是插件栏右边的那个音乐按钮
  navigator.mediaSession.setActionHandler('previoustrack', audioStore.setNextSong)
  navigator.mediaSession.setActionHandler('nexttrack', audioStore.setNextSong)
  // #endif
}
