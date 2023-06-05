import * as React from 'react'
import { FormContainer, TaskInput, MinutesAmountInput} from './styles'

export function NewCylceForm() {
    return (
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em: </label>
          <TaskInput
            type="text"
            id="task"
            disabled={!!activeCycle}
            placeholder="Dê um nome para seu projeto"
            list="task-suggestions"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Batata" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            disabled={!!activeCycle}
            placeholder="00"
            step={5}
            min={1}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>
    )
}