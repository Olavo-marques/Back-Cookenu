import { v4 } from 'uuid'

export class GenerateId {
    public generate = () => {
        return v4()
    }
}