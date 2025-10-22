export abstract class BaseService<T, CreateDTO, UpdateDTO, ResponseDTO> {
  protected abstract mapToResponseDTO(entity: T): ResponseDTO;

  protected async processEntityList(entities: T[]): Promise<ResponseDTO[]> {
    return entities.map(this.mapToResponseDTO);
  }

  protected async processEntity(entity: T | null): Promise<ResponseDTO | null> {
    return entity ? this.mapToResponseDTO(entity) : null;
  }

  protected parseDecimal(value: any): number {
    return parseFloat(value.toString());
  }

  protected validateRequiredFields(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
    }
  }
}
