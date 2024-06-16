import Image from 'next/image'

export const Play = () => {
  return (
    <Image
      src="/play.svg"
      alt="play"
      width={24}
      height={24}
      className="invert"
    />
  )
}

export const Pause = () => {
  return (
    <Image
      src="/pause.svg"
      alt="pause"
      width={24}
      height={24}
      className="invert"
    />
  )
}
