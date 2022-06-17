import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "anothertable" */
export type Anothertable = {
  __typename?: 'anothertable';
  id: Scalars['Int'];
};

/** aggregated selection of "anothertable" */
export type Anothertable_Aggregate = {
  __typename?: 'anothertable_aggregate';
  aggregate?: Maybe<Anothertable_Aggregate_Fields>;
  nodes: Array<Anothertable>;
};

/** aggregate fields of "anothertable" */
export type Anothertable_Aggregate_Fields = {
  __typename?: 'anothertable_aggregate_fields';
  avg?: Maybe<Anothertable_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Anothertable_Max_Fields>;
  min?: Maybe<Anothertable_Min_Fields>;
  stddev?: Maybe<Anothertable_Stddev_Fields>;
  stddev_pop?: Maybe<Anothertable_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Anothertable_Stddev_Samp_Fields>;
  sum?: Maybe<Anothertable_Sum_Fields>;
  var_pop?: Maybe<Anothertable_Var_Pop_Fields>;
  var_samp?: Maybe<Anothertable_Var_Samp_Fields>;
  variance?: Maybe<Anothertable_Variance_Fields>;
};


/** aggregate fields of "anothertable" */
export type Anothertable_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Anothertable_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Anothertable_Avg_Fields = {
  __typename?: 'anothertable_avg_fields';
  id?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "anothertable". All fields are combined with a logical 'AND'. */
export type Anothertable_Bool_Exp = {
  _and?: InputMaybe<Array<Anothertable_Bool_Exp>>;
  _not?: InputMaybe<Anothertable_Bool_Exp>;
  _or?: InputMaybe<Array<Anothertable_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "anothertable" */
export enum Anothertable_Constraint {
  /** unique or primary key constraint */
  AnothertablePkey = 'anothertable_pkey'
}

/** input type for incrementing numeric columns in table "anothertable" */
export type Anothertable_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "anothertable" */
export type Anothertable_Insert_Input = {
  id?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Anothertable_Max_Fields = {
  __typename?: 'anothertable_max_fields';
  id?: Maybe<Scalars['Int']>;
};

/** aggregate min on columns */
export type Anothertable_Min_Fields = {
  __typename?: 'anothertable_min_fields';
  id?: Maybe<Scalars['Int']>;
};

/** response of any mutation on the table "anothertable" */
export type Anothertable_Mutation_Response = {
  __typename?: 'anothertable_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Anothertable>;
};

/** on_conflict condition type for table "anothertable" */
export type Anothertable_On_Conflict = {
  constraint: Anothertable_Constraint;
  update_columns?: Array<Anothertable_Update_Column>;
  where?: InputMaybe<Anothertable_Bool_Exp>;
};

/** Ordering options when selecting data from "anothertable". */
export type Anothertable_Order_By = {
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: anothertable */
export type Anothertable_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "anothertable" */
export enum Anothertable_Select_Column {
  /** column name */
  Id = 'id'
}

/** input type for updating data in table "anothertable" */
export type Anothertable_Set_Input = {
  id?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Anothertable_Stddev_Fields = {
  __typename?: 'anothertable_stddev_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Anothertable_Stddev_Pop_Fields = {
  __typename?: 'anothertable_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Anothertable_Stddev_Samp_Fields = {
  __typename?: 'anothertable_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Anothertable_Sum_Fields = {
  __typename?: 'anothertable_sum_fields';
  id?: Maybe<Scalars['Int']>;
};

/** update columns of table "anothertable" */
export enum Anothertable_Update_Column {
  /** column name */
  Id = 'id'
}

/** aggregate var_pop on columns */
export type Anothertable_Var_Pop_Fields = {
  __typename?: 'anothertable_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Anothertable_Var_Samp_Fields = {
  __typename?: 'anothertable_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Anothertable_Variance_Fields = {
  __typename?: 'anothertable_variance_fields';
  id?: Maybe<Scalars['Float']>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "anothertable" */
  delete_anothertable?: Maybe<Anothertable_Mutation_Response>;
  /** delete single row from the table: "anothertable" */
  delete_anothertable_by_pk?: Maybe<Anothertable>;
  /** delete data from the table: "record" */
  delete_record?: Maybe<Record_Mutation_Response>;
  /** delete single row from the table: "record" */
  delete_record_by_pk?: Maybe<Record>;
  /** insert data into the table: "anothertable" */
  insert_anothertable?: Maybe<Anothertable_Mutation_Response>;
  /** insert a single row into the table: "anothertable" */
  insert_anothertable_one?: Maybe<Anothertable>;
  /** insert data into the table: "record" */
  insert_record?: Maybe<Record_Mutation_Response>;
  /** insert a single row into the table: "record" */
  insert_record_one?: Maybe<Record>;
  /** update data of the table: "anothertable" */
  update_anothertable?: Maybe<Anothertable_Mutation_Response>;
  /** update single row of the table: "anothertable" */
  update_anothertable_by_pk?: Maybe<Anothertable>;
  /** update data of the table: "record" */
  update_record?: Maybe<Record_Mutation_Response>;
  /** update single row of the table: "record" */
  update_record_by_pk?: Maybe<Record>;
};


/** mutation root */
export type Mutation_RootDelete_AnothertableArgs = {
  where: Anothertable_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Anothertable_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_RecordArgs = {
  where: Record_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Record_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootInsert_AnothertableArgs = {
  objects: Array<Anothertable_Insert_Input>;
  on_conflict?: InputMaybe<Anothertable_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Anothertable_OneArgs = {
  object: Anothertable_Insert_Input;
  on_conflict?: InputMaybe<Anothertable_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RecordArgs = {
  objects: Array<Record_Insert_Input>;
  on_conflict?: InputMaybe<Record_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Record_OneArgs = {
  object: Record_Insert_Input;
  on_conflict?: InputMaybe<Record_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_AnothertableArgs = {
  _inc?: InputMaybe<Anothertable_Inc_Input>;
  _set?: InputMaybe<Anothertable_Set_Input>;
  where: Anothertable_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Anothertable_By_PkArgs = {
  _inc?: InputMaybe<Anothertable_Inc_Input>;
  _set?: InputMaybe<Anothertable_Set_Input>;
  pk_columns: Anothertable_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_RecordArgs = {
  _inc?: InputMaybe<Record_Inc_Input>;
  _set?: InputMaybe<Record_Set_Input>;
  where: Record_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Record_By_PkArgs = {
  _inc?: InputMaybe<Record_Inc_Input>;
  _set?: InputMaybe<Record_Set_Input>;
  pk_columns: Record_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "anothertable" */
  anothertable: Array<Anothertable>;
  /** fetch aggregated fields from the table: "anothertable" */
  anothertable_aggregate: Anothertable_Aggregate;
  /** fetch data from the table: "anothertable" using primary key columns */
  anothertable_by_pk?: Maybe<Anothertable>;
  /** fetch data from the table: "record" */
  record: Array<Record>;
  /** fetch aggregated fields from the table: "record" */
  record_aggregate: Record_Aggregate;
  /** fetch data from the table: "record" using primary key columns */
  record_by_pk?: Maybe<Record>;
};


export type Query_RootAnothertableArgs = {
  distinct_on?: InputMaybe<Array<Anothertable_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Anothertable_Order_By>>;
  where?: InputMaybe<Anothertable_Bool_Exp>;
};


export type Query_RootAnothertable_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Anothertable_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Anothertable_Order_By>>;
  where?: InputMaybe<Anothertable_Bool_Exp>;
};


export type Query_RootAnothertable_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootRecordArgs = {
  distinct_on?: InputMaybe<Array<Record_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Record_Order_By>>;
  where?: InputMaybe<Record_Bool_Exp>;
};


export type Query_RootRecord_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Record_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Record_Order_By>>;
  where?: InputMaybe<Record_Bool_Exp>;
};


export type Query_RootRecord_By_PkArgs = {
  id: Scalars['Int'];
};

/** columns and relationships of "record" */
export type Record = {
  __typename?: 'record';
  active: Scalars['Boolean'];
  boundary: Scalars['String'];
  id: Scalars['Int'];
  label: Scalars['String'];
  periodicity: Scalars['Int'];
  tags?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

/** aggregated selection of "record" */
export type Record_Aggregate = {
  __typename?: 'record_aggregate';
  aggregate?: Maybe<Record_Aggregate_Fields>;
  nodes: Array<Record>;
};

/** aggregate fields of "record" */
export type Record_Aggregate_Fields = {
  __typename?: 'record_aggregate_fields';
  avg?: Maybe<Record_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Record_Max_Fields>;
  min?: Maybe<Record_Min_Fields>;
  stddev?: Maybe<Record_Stddev_Fields>;
  stddev_pop?: Maybe<Record_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Record_Stddev_Samp_Fields>;
  sum?: Maybe<Record_Sum_Fields>;
  var_pop?: Maybe<Record_Var_Pop_Fields>;
  var_samp?: Maybe<Record_Var_Samp_Fields>;
  variance?: Maybe<Record_Variance_Fields>;
};


/** aggregate fields of "record" */
export type Record_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Record_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Record_Avg_Fields = {
  __typename?: 'record_avg_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "record". All fields are combined with a logical 'AND'. */
export type Record_Bool_Exp = {
  _and?: InputMaybe<Array<Record_Bool_Exp>>;
  _not?: InputMaybe<Record_Bool_Exp>;
  _or?: InputMaybe<Array<Record_Bool_Exp>>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  boundary?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  periodicity?: InputMaybe<Int_Comparison_Exp>;
  tags?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "record" */
export enum Record_Constraint {
  /** unique or primary key constraint */
  RecordPkey = 'record_pkey'
}

/** input type for incrementing numeric columns in table "record" */
export type Record_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
  periodicity?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "record" */
export type Record_Insert_Input = {
  active?: InputMaybe<Scalars['Boolean']>;
  boundary?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  label?: InputMaybe<Scalars['String']>;
  periodicity?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Record_Max_Fields = {
  __typename?: 'record_max_fields';
  boundary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['String']>;
  periodicity?: Maybe<Scalars['Int']>;
  tags?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Record_Min_Fields = {
  __typename?: 'record_min_fields';
  boundary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['String']>;
  periodicity?: Maybe<Scalars['Int']>;
  tags?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "record" */
export type Record_Mutation_Response = {
  __typename?: 'record_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Record>;
};

/** on_conflict condition type for table "record" */
export type Record_On_Conflict = {
  constraint: Record_Constraint;
  update_columns?: Array<Record_Update_Column>;
  where?: InputMaybe<Record_Bool_Exp>;
};

/** Ordering options when selecting data from "record". */
export type Record_Order_By = {
  active?: InputMaybe<Order_By>;
  boundary?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  periodicity?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: record */
export type Record_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "record" */
export enum Record_Select_Column {
  /** column name */
  Active = 'active',
  /** column name */
  Boundary = 'boundary',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Periodicity = 'periodicity',
  /** column name */
  Tags = 'tags',
  /** column name */
  Url = 'url'
}

/** input type for updating data in table "record" */
export type Record_Set_Input = {
  active?: InputMaybe<Scalars['Boolean']>;
  boundary?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  label?: InputMaybe<Scalars['String']>;
  periodicity?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Record_Stddev_Fields = {
  __typename?: 'record_stddev_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Record_Stddev_Pop_Fields = {
  __typename?: 'record_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Record_Stddev_Samp_Fields = {
  __typename?: 'record_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Record_Sum_Fields = {
  __typename?: 'record_sum_fields';
  id?: Maybe<Scalars['Int']>;
  periodicity?: Maybe<Scalars['Int']>;
};

/** update columns of table "record" */
export enum Record_Update_Column {
  /** column name */
  Active = 'active',
  /** column name */
  Boundary = 'boundary',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Periodicity = 'periodicity',
  /** column name */
  Tags = 'tags',
  /** column name */
  Url = 'url'
}

/** aggregate var_pop on columns */
export type Record_Var_Pop_Fields = {
  __typename?: 'record_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Record_Var_Samp_Fields = {
  __typename?: 'record_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Record_Variance_Fields = {
  __typename?: 'record_variance_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "anothertable" */
  anothertable: Array<Anothertable>;
  /** fetch aggregated fields from the table: "anothertable" */
  anothertable_aggregate: Anothertable_Aggregate;
  /** fetch data from the table: "anothertable" using primary key columns */
  anothertable_by_pk?: Maybe<Anothertable>;
  /** fetch data from the table: "record" */
  record: Array<Record>;
  /** fetch aggregated fields from the table: "record" */
  record_aggregate: Record_Aggregate;
  /** fetch data from the table: "record" using primary key columns */
  record_by_pk?: Maybe<Record>;
};


export type Subscription_RootAnothertableArgs = {
  distinct_on?: InputMaybe<Array<Anothertable_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Anothertable_Order_By>>;
  where?: InputMaybe<Anothertable_Bool_Exp>;
};


export type Subscription_RootAnothertable_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Anothertable_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Anothertable_Order_By>>;
  where?: InputMaybe<Anothertable_Bool_Exp>;
};


export type Subscription_RootAnothertable_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootRecordArgs = {
  distinct_on?: InputMaybe<Array<Record_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Record_Order_By>>;
  where?: InputMaybe<Record_Bool_Exp>;
};


export type Subscription_RootRecord_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Record_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Record_Order_By>>;
  where?: InputMaybe<Record_Bool_Exp>;
};


export type Subscription_RootRecord_By_PkArgs = {
  id: Scalars['Int'];
};

export type AllRecordsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllRecordsQuery = { __typename?: 'query_root', record: Array<{ __typename?: 'record', id: number, active: boolean, boundary: string, label: string, periodicity: number, tags?: string | null, url: string }> };

export type GetRecordQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']>;
}>;


export type GetRecordQuery = { __typename?: 'query_root', record_by_pk?: { __typename?: 'record', active: boolean, boundary: string, id: number, label: string, periodicity: number, tags?: string | null, url: string } | null };


export const AllRecordsDocument = gql`
    query AllRecords {
  record {
    id
    active
    boundary
    label
    periodicity
    tags
    url
  }
}
    `;

export function useAllRecordsQuery(options?: Omit<Urql.UseQueryArgs<AllRecordsQueryVariables>, 'query'>) {
  return Urql.useQuery<AllRecordsQuery>({ query: AllRecordsDocument, ...options });
};
export const GetRecordDocument = gql`
    query GetRecord($id: Int = 10) {
  record_by_pk(id: $id) {
    active
    boundary
    id
    label
    periodicity
    tags
    url
  }
}
    `;

export function useGetRecordQuery(options?: Omit<Urql.UseQueryArgs<GetRecordQueryVariables>, 'query'>) {
  return Urql.useQuery<GetRecordQuery>({ query: GetRecordDocument, ...options });
};