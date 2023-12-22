import {AnyError} from '../../mod.ts'

/**  */
export class Mock {
  private mock_list: Record<string, Function>
  constructor(list: Record<string, Function>) {
    this.mock_list = list
  }

  /**  */
  //  async get_mock(event_name: string): Promise<AnyError<'Error'>> {
  //     await
  //   }
}
