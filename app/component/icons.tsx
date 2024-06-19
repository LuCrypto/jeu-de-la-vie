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

export const Expand = () => {
  return (
    <Image
      src="/expand.svg"
      alt="expand"
      width={24}
      height={24}
      className="invert"
    />
  )
}

export const Collapse = () => {
  return (
    <Image
      src="/collapse.svg"
      alt="collapse"
      width={24}
      height={24}
      className="invert"
    />
  )
}

export const Arrow = () => {
  return <Image src="/arrow.png" alt="arrow" width={24} height={24} />
}

export const ArrowRight = () => {
  return (
    <Image
      src="/arrow.png"
      alt="arrow"
      style={{ transform: 'scaleX(-1)' }}
      width={24}
      height={24}
    />
  )
}
