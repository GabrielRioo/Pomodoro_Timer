import {
  ReactNode,
  createContext,
  useState,
  useReducer,
  useEffect,
} from 'react'
import { Cycle, CyclesReducer } from '../reduces/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  maskCurrentCycleAsFinishedAction,
} from '../reduces/cycles/actions'
import { differenceInSeconds } from 'date-fns'

interface CreateCycleDate {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  cycles: Cycle[]
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleDate) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CycleContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    CyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        '@pomodoro:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return {
        initialState,
      }
    },
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@pomodoro:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    // Alterando o ciclo ativo para por a date de interrupção
    dispatch(maskCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleDate) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    // usar quando um estado depende da sua versao antetior: "state => ...."
    dispatch(addNewCycleAction(newCycle))
    // setCycles((state) => [...state, newCylce])
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    // // Alterando o ciclo ativo para por a date de interrupção
    dispatch(interruptCurrentCycleAction())
    // Nao haverá mais ciclos ativos
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        cycles,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
