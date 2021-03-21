export interface IMasRelationship {
    RELATIONSHIP_ID: number;
    RELATIONSHIP_NAME: string;
    IS_ACTIVE: number;
}

export interface IMasRelationshipgetByCon {
    TEXT_SEARCH: string;
    RELATIONSHIP_ID?: number;
}