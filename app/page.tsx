import GameLife from './component/gameLife'
import GameLifeLenia from './component/gameLifeLenia'

export default function Home() {
  return (
    <div className="h-full m-4 flex flex-col">
      <GameLife />
      <GameLifeLenia />
    </div>
  )
}
