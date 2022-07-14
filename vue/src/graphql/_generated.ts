import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
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

/** columns and relationships of "executions" */
export type Executions = {
  __typename?: 'executions';
  crawltime?: Maybe<Scalars['String']>;
  /** An array relationship */
  executionsConnectionsByIdTo: Array<Executions_Connections>;
  /** An aggregate relationship */
  executionsConnectionsByIdTo_aggregate: Executions_Connections_Aggregate;
  /** An array relationship */
  executions_connections: Array<Executions_Connections>;
  /** An aggregate relationship */
  executions_connections_aggregate: Executions_Connections_Aggregate;
  id: Scalars['Int'];
  owner: Scalars['Int'];
  /** An object relationship */
  record: Records;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};


/** columns and relationships of "executions" */
export type ExecutionsExecutionsConnectionsByIdToArgs = {
  distinct_on?: InputMaybe<Array<Executions_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Connections_Order_By>>;
  where?: InputMaybe<Executions_Connections_Bool_Exp>;
};


/** columns and relationships of "executions" */
export type ExecutionsExecutionsConnectionsByIdTo_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Executions_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Connections_Order_By>>;
  where?: InputMaybe<Executions_Connections_Bool_Exp>;
};


/** columns and relationships of "executions" */
export type ExecutionsExecutions_ConnectionsArgs = {
  distinct_on?: InputMaybe<Array<Executions_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Connections_Order_By>>;
  where?: InputMaybe<Executions_Connections_Bool_Exp>;
};


/** columns and relationships of "executions" */
export type ExecutionsExecutions_Connections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Executions_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Connections_Order_By>>;
  where?: InputMaybe<Executions_Connections_Bool_Exp>;
};

/** aggregated selection of "executions" */
export type Executions_Aggregate = {
  __typename?: 'executions_aggregate';
  aggregate?: Maybe<Executions_Aggregate_Fields>;
  nodes: Array<Executions>;
};

/** aggregate fields of "executions" */
export type Executions_Aggregate_Fields = {
  __typename?: 'executions_aggregate_fields';
  avg?: Maybe<Executions_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Executions_Max_Fields>;
  min?: Maybe<Executions_Min_Fields>;
  stddev?: Maybe<Executions_Stddev_Fields>;
  stddev_pop?: Maybe<Executions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Executions_Stddev_Samp_Fields>;
  sum?: Maybe<Executions_Sum_Fields>;
  var_pop?: Maybe<Executions_Var_Pop_Fields>;
  var_samp?: Maybe<Executions_Var_Samp_Fields>;
  variance?: Maybe<Executions_Variance_Fields>;
};


/** aggregate fields of "executions" */
export type Executions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Executions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "executions" */
export type Executions_Aggregate_Order_By = {
  avg?: InputMaybe<Executions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Executions_Max_Order_By>;
  min?: InputMaybe<Executions_Min_Order_By>;
  stddev?: InputMaybe<Executions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Executions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Executions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Executions_Sum_Order_By>;
  var_pop?: InputMaybe<Executions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Executions_Var_Samp_Order_By>;
  variance?: InputMaybe<Executions_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "executions" */
export type Executions_Arr_Rel_Insert_Input = {
  data: Array<Executions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Executions_On_Conflict>;
};

/** aggregate avg on columns */
export type Executions_Avg_Fields = {
  __typename?: 'executions_avg_fields';
  id?: Maybe<Scalars['Float']>;
  owner?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "executions" */
export type Executions_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "executions". All fields are combined with a logical 'AND'. */
export type Executions_Bool_Exp = {
  _and?: InputMaybe<Array<Executions_Bool_Exp>>;
  _not?: InputMaybe<Executions_Bool_Exp>;
  _or?: InputMaybe<Array<Executions_Bool_Exp>>;
  crawltime?: InputMaybe<String_Comparison_Exp>;
  executionsConnectionsByIdTo?: InputMaybe<Executions_Connections_Bool_Exp>;
  executions_connections?: InputMaybe<Executions_Connections_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  owner?: InputMaybe<Int_Comparison_Exp>;
  record?: InputMaybe<Records_Bool_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
};

/** columns and relationships of "executions_connections" */
export type Executions_Connections = {
  __typename?: 'executions_connections';
  /** An object relationship */
  execution: Executions;
  /** An object relationship */
  executionByIdTo: Executions;
  id: Scalars['Int'];
  id_from: Scalars['Int'];
  id_to: Scalars['Int'];
};

/** aggregated selection of "executions_connections" */
export type Executions_Connections_Aggregate = {
  __typename?: 'executions_connections_aggregate';
  aggregate?: Maybe<Executions_Connections_Aggregate_Fields>;
  nodes: Array<Executions_Connections>;
};

/** aggregate fields of "executions_connections" */
export type Executions_Connections_Aggregate_Fields = {
  __typename?: 'executions_connections_aggregate_fields';
  avg?: Maybe<Executions_Connections_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Executions_Connections_Max_Fields>;
  min?: Maybe<Executions_Connections_Min_Fields>;
  stddev?: Maybe<Executions_Connections_Stddev_Fields>;
  stddev_pop?: Maybe<Executions_Connections_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Executions_Connections_Stddev_Samp_Fields>;
  sum?: Maybe<Executions_Connections_Sum_Fields>;
  var_pop?: Maybe<Executions_Connections_Var_Pop_Fields>;
  var_samp?: Maybe<Executions_Connections_Var_Samp_Fields>;
  variance?: Maybe<Executions_Connections_Variance_Fields>;
};


/** aggregate fields of "executions_connections" */
export type Executions_Connections_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Executions_Connections_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "executions_connections" */
export type Executions_Connections_Aggregate_Order_By = {
  avg?: InputMaybe<Executions_Connections_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Executions_Connections_Max_Order_By>;
  min?: InputMaybe<Executions_Connections_Min_Order_By>;
  stddev?: InputMaybe<Executions_Connections_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Executions_Connections_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Executions_Connections_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Executions_Connections_Sum_Order_By>;
  var_pop?: InputMaybe<Executions_Connections_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Executions_Connections_Var_Samp_Order_By>;
  variance?: InputMaybe<Executions_Connections_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "executions_connections" */
export type Executions_Connections_Arr_Rel_Insert_Input = {
  data: Array<Executions_Connections_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Executions_Connections_On_Conflict>;
};

/** aggregate avg on columns */
export type Executions_Connections_Avg_Fields = {
  __typename?: 'executions_connections_avg_fields';
  id?: Maybe<Scalars['Float']>;
  id_from?: Maybe<Scalars['Float']>;
  id_to?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "executions_connections" */
export type Executions_Connections_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "executions_connections". All fields are combined with a logical 'AND'. */
export type Executions_Connections_Bool_Exp = {
  _and?: InputMaybe<Array<Executions_Connections_Bool_Exp>>;
  _not?: InputMaybe<Executions_Connections_Bool_Exp>;
  _or?: InputMaybe<Array<Executions_Connections_Bool_Exp>>;
  execution?: InputMaybe<Executions_Bool_Exp>;
  executionByIdTo?: InputMaybe<Executions_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  id_from?: InputMaybe<Int_Comparison_Exp>;
  id_to?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "executions_connections" */
export enum Executions_Connections_Constraint {
  /** unique or primary key constraint */
  ExecutionsConnectionsPkey = 'executions_connections_pkey'
}

/** input type for incrementing numeric columns in table "executions_connections" */
export type Executions_Connections_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
  id_from?: InputMaybe<Scalars['Int']>;
  id_to?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "executions_connections" */
export type Executions_Connections_Insert_Input = {
  execution?: InputMaybe<Executions_Obj_Rel_Insert_Input>;
  executionByIdTo?: InputMaybe<Executions_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']>;
  id_from?: InputMaybe<Scalars['Int']>;
  id_to?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Executions_Connections_Max_Fields = {
  __typename?: 'executions_connections_max_fields';
  id?: Maybe<Scalars['Int']>;
  id_from?: Maybe<Scalars['Int']>;
  id_to?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "executions_connections" */
export type Executions_Connections_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Executions_Connections_Min_Fields = {
  __typename?: 'executions_connections_min_fields';
  id?: Maybe<Scalars['Int']>;
  id_from?: Maybe<Scalars['Int']>;
  id_to?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "executions_connections" */
export type Executions_Connections_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "executions_connections" */
export type Executions_Connections_Mutation_Response = {
  __typename?: 'executions_connections_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Executions_Connections>;
};

/** on_conflict condition type for table "executions_connections" */
export type Executions_Connections_On_Conflict = {
  constraint: Executions_Connections_Constraint;
  update_columns?: Array<Executions_Connections_Update_Column>;
  where?: InputMaybe<Executions_Connections_Bool_Exp>;
};

/** Ordering options when selecting data from "executions_connections". */
export type Executions_Connections_Order_By = {
  execution?: InputMaybe<Executions_Order_By>;
  executionByIdTo?: InputMaybe<Executions_Order_By>;
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** primary key columns input for table: executions_connections */
export type Executions_Connections_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "executions_connections" */
export enum Executions_Connections_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IdFrom = 'id_from',
  /** column name */
  IdTo = 'id_to'
}

/** input type for updating data in table "executions_connections" */
export type Executions_Connections_Set_Input = {
  id?: InputMaybe<Scalars['Int']>;
  id_from?: InputMaybe<Scalars['Int']>;
  id_to?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Executions_Connections_Stddev_Fields = {
  __typename?: 'executions_connections_stddev_fields';
  id?: Maybe<Scalars['Float']>;
  id_from?: Maybe<Scalars['Float']>;
  id_to?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "executions_connections" */
export type Executions_Connections_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Executions_Connections_Stddev_Pop_Fields = {
  __typename?: 'executions_connections_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
  id_from?: Maybe<Scalars['Float']>;
  id_to?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "executions_connections" */
export type Executions_Connections_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Executions_Connections_Stddev_Samp_Fields = {
  __typename?: 'executions_connections_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
  id_from?: Maybe<Scalars['Float']>;
  id_to?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "executions_connections" */
export type Executions_Connections_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Executions_Connections_Sum_Fields = {
  __typename?: 'executions_connections_sum_fields';
  id?: Maybe<Scalars['Int']>;
  id_from?: Maybe<Scalars['Int']>;
  id_to?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "executions_connections" */
export type Executions_Connections_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** update columns of table "executions_connections" */
export enum Executions_Connections_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IdFrom = 'id_from',
  /** column name */
  IdTo = 'id_to'
}

/** aggregate var_pop on columns */
export type Executions_Connections_Var_Pop_Fields = {
  __typename?: 'executions_connections_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
  id_from?: Maybe<Scalars['Float']>;
  id_to?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "executions_connections" */
export type Executions_Connections_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Executions_Connections_Var_Samp_Fields = {
  __typename?: 'executions_connections_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
  id_from?: Maybe<Scalars['Float']>;
  id_to?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "executions_connections" */
export type Executions_Connections_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Executions_Connections_Variance_Fields = {
  __typename?: 'executions_connections_variance_fields';
  id?: Maybe<Scalars['Float']>;
  id_from?: Maybe<Scalars['Float']>;
  id_to?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "executions_connections" */
export type Executions_Connections_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  id_from?: InputMaybe<Order_By>;
  id_to?: InputMaybe<Order_By>;
};

/** unique or primary key constraints on table "executions" */
export enum Executions_Constraint {
  /** unique or primary key constraint */
  ExecutionsPkey = 'executions_pkey'
}

/** input type for incrementing numeric columns in table "executions" */
export type Executions_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
  owner?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "executions" */
export type Executions_Insert_Input = {
  crawltime?: InputMaybe<Scalars['String']>;
  executionsConnectionsByIdTo?: InputMaybe<Executions_Connections_Arr_Rel_Insert_Input>;
  executions_connections?: InputMaybe<Executions_Connections_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']>;
  owner?: InputMaybe<Scalars['Int']>;
  record?: InputMaybe<Records_Obj_Rel_Insert_Input>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Executions_Max_Fields = {
  __typename?: 'executions_max_fields';
  crawltime?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  owner?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "executions" */
export type Executions_Max_Order_By = {
  crawltime?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Executions_Min_Fields = {
  __typename?: 'executions_min_fields';
  crawltime?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  owner?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "executions" */
export type Executions_Min_Order_By = {
  crawltime?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "executions" */
export type Executions_Mutation_Response = {
  __typename?: 'executions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Executions>;
};

/** input type for inserting object relation for remote table "executions" */
export type Executions_Obj_Rel_Insert_Input = {
  data: Executions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Executions_On_Conflict>;
};

/** on_conflict condition type for table "executions" */
export type Executions_On_Conflict = {
  constraint: Executions_Constraint;
  update_columns?: Array<Executions_Update_Column>;
  where?: InputMaybe<Executions_Bool_Exp>;
};

/** Ordering options when selecting data from "executions". */
export type Executions_Order_By = {
  crawltime?: InputMaybe<Order_By>;
  executionsConnectionsByIdTo_aggregate?: InputMaybe<Executions_Connections_Aggregate_Order_By>;
  executions_connections_aggregate?: InputMaybe<Executions_Connections_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  record?: InputMaybe<Records_Order_By>;
  title?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: executions */
export type Executions_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "executions" */
export enum Executions_Select_Column {
  /** column name */
  Crawltime = 'crawltime',
  /** column name */
  Id = 'id',
  /** column name */
  Owner = 'owner',
  /** column name */
  Title = 'title',
  /** column name */
  Url = 'url'
}

/** input type for updating data in table "executions" */
export type Executions_Set_Input = {
  crawltime?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  owner?: InputMaybe<Scalars['Int']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Executions_Stddev_Fields = {
  __typename?: 'executions_stddev_fields';
  id?: Maybe<Scalars['Float']>;
  owner?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "executions" */
export type Executions_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Executions_Stddev_Pop_Fields = {
  __typename?: 'executions_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
  owner?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "executions" */
export type Executions_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Executions_Stddev_Samp_Fields = {
  __typename?: 'executions_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
  owner?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "executions" */
export type Executions_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Executions_Sum_Fields = {
  __typename?: 'executions_sum_fields';
  id?: Maybe<Scalars['Int']>;
  owner?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "executions" */
export type Executions_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
};

/** update columns of table "executions" */
export enum Executions_Update_Column {
  /** column name */
  Crawltime = 'crawltime',
  /** column name */
  Id = 'id',
  /** column name */
  Owner = 'owner',
  /** column name */
  Title = 'title',
  /** column name */
  Url = 'url'
}

/** aggregate var_pop on columns */
export type Executions_Var_Pop_Fields = {
  __typename?: 'executions_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
  owner?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "executions" */
export type Executions_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Executions_Var_Samp_Fields = {
  __typename?: 'executions_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
  owner?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "executions" */
export type Executions_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Executions_Variance_Fields = {
  __typename?: 'executions_variance_fields';
  id?: Maybe<Scalars['Float']>;
  owner?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "executions" */
export type Executions_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "executions" */
  delete_executions?: Maybe<Executions_Mutation_Response>;
  /** delete single row from the table: "executions" */
  delete_executions_by_pk?: Maybe<Executions>;
  /** delete data from the table: "executions_connections" */
  delete_executions_connections?: Maybe<Executions_Connections_Mutation_Response>;
  /** delete single row from the table: "executions_connections" */
  delete_executions_connections_by_pk?: Maybe<Executions_Connections>;
  /** delete data from the table: "records" */
  delete_records?: Maybe<Records_Mutation_Response>;
  /** delete single row from the table: "records" */
  delete_records_by_pk?: Maybe<Records>;
  /** delete data from the table: "tags" */
  delete_tags?: Maybe<Tags_Mutation_Response>;
  /** delete single row from the table: "tags" */
  delete_tags_by_pk?: Maybe<Tags>;
  /** delete data from the table: "tags_records_relations" */
  delete_tags_records_relations?: Maybe<Tags_Records_Relations_Mutation_Response>;
  /** delete single row from the table: "tags_records_relations" */
  delete_tags_records_relations_by_pk?: Maybe<Tags_Records_Relations>;
  /** insert data into the table: "executions" */
  insert_executions?: Maybe<Executions_Mutation_Response>;
  /** insert data into the table: "executions_connections" */
  insert_executions_connections?: Maybe<Executions_Connections_Mutation_Response>;
  /** insert a single row into the table: "executions_connections" */
  insert_executions_connections_one?: Maybe<Executions_Connections>;
  /** insert a single row into the table: "executions" */
  insert_executions_one?: Maybe<Executions>;
  /** insert data into the table: "records" */
  insert_records?: Maybe<Records_Mutation_Response>;
  /** insert a single row into the table: "records" */
  insert_records_one?: Maybe<Records>;
  /** insert data into the table: "tags" */
  insert_tags?: Maybe<Tags_Mutation_Response>;
  /** insert a single row into the table: "tags" */
  insert_tags_one?: Maybe<Tags>;
  /** insert data into the table: "tags_records_relations" */
  insert_tags_records_relations?: Maybe<Tags_Records_Relations_Mutation_Response>;
  /** insert a single row into the table: "tags_records_relations" */
  insert_tags_records_relations_one?: Maybe<Tags_Records_Relations>;
  /** update data of the table: "executions" */
  update_executions?: Maybe<Executions_Mutation_Response>;
  /** update single row of the table: "executions" */
  update_executions_by_pk?: Maybe<Executions>;
  /** update data of the table: "executions_connections" */
  update_executions_connections?: Maybe<Executions_Connections_Mutation_Response>;
  /** update single row of the table: "executions_connections" */
  update_executions_connections_by_pk?: Maybe<Executions_Connections>;
  /** update data of the table: "records" */
  update_records?: Maybe<Records_Mutation_Response>;
  /** update single row of the table: "records" */
  update_records_by_pk?: Maybe<Records>;
  /** update data of the table: "tags" */
  update_tags?: Maybe<Tags_Mutation_Response>;
  /** update single row of the table: "tags" */
  update_tags_by_pk?: Maybe<Tags>;
  /** update data of the table: "tags_records_relations" */
  update_tags_records_relations?: Maybe<Tags_Records_Relations_Mutation_Response>;
  /** update single row of the table: "tags_records_relations" */
  update_tags_records_relations_by_pk?: Maybe<Tags_Records_Relations>;
};


/** mutation root */
export type Mutation_RootDelete_ExecutionsArgs = {
  where: Executions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Executions_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Executions_ConnectionsArgs = {
  where: Executions_Connections_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Executions_Connections_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_RecordsArgs = {
  where: Records_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Records_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_TagsArgs = {
  where: Tags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Tags_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Tags_Records_RelationsArgs = {
  where: Tags_Records_Relations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Tags_Records_Relations_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootInsert_ExecutionsArgs = {
  objects: Array<Executions_Insert_Input>;
  on_conflict?: InputMaybe<Executions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Executions_ConnectionsArgs = {
  objects: Array<Executions_Connections_Insert_Input>;
  on_conflict?: InputMaybe<Executions_Connections_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Executions_Connections_OneArgs = {
  object: Executions_Connections_Insert_Input;
  on_conflict?: InputMaybe<Executions_Connections_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Executions_OneArgs = {
  object: Executions_Insert_Input;
  on_conflict?: InputMaybe<Executions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RecordsArgs = {
  objects: Array<Records_Insert_Input>;
  on_conflict?: InputMaybe<Records_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Records_OneArgs = {
  object: Records_Insert_Input;
  on_conflict?: InputMaybe<Records_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TagsArgs = {
  objects: Array<Tags_Insert_Input>;
  on_conflict?: InputMaybe<Tags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Tags_OneArgs = {
  object: Tags_Insert_Input;
  on_conflict?: InputMaybe<Tags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Tags_Records_RelationsArgs = {
  objects: Array<Tags_Records_Relations_Insert_Input>;
  on_conflict?: InputMaybe<Tags_Records_Relations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Tags_Records_Relations_OneArgs = {
  object: Tags_Records_Relations_Insert_Input;
  on_conflict?: InputMaybe<Tags_Records_Relations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_ExecutionsArgs = {
  _inc?: InputMaybe<Executions_Inc_Input>;
  _set?: InputMaybe<Executions_Set_Input>;
  where: Executions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Executions_By_PkArgs = {
  _inc?: InputMaybe<Executions_Inc_Input>;
  _set?: InputMaybe<Executions_Set_Input>;
  pk_columns: Executions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Executions_ConnectionsArgs = {
  _inc?: InputMaybe<Executions_Connections_Inc_Input>;
  _set?: InputMaybe<Executions_Connections_Set_Input>;
  where: Executions_Connections_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Executions_Connections_By_PkArgs = {
  _inc?: InputMaybe<Executions_Connections_Inc_Input>;
  _set?: InputMaybe<Executions_Connections_Set_Input>;
  pk_columns: Executions_Connections_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_RecordsArgs = {
  _inc?: InputMaybe<Records_Inc_Input>;
  _set?: InputMaybe<Records_Set_Input>;
  where: Records_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Records_By_PkArgs = {
  _inc?: InputMaybe<Records_Inc_Input>;
  _set?: InputMaybe<Records_Set_Input>;
  pk_columns: Records_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_TagsArgs = {
  _inc?: InputMaybe<Tags_Inc_Input>;
  _set?: InputMaybe<Tags_Set_Input>;
  where: Tags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Tags_By_PkArgs = {
  _inc?: InputMaybe<Tags_Inc_Input>;
  _set?: InputMaybe<Tags_Set_Input>;
  pk_columns: Tags_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Tags_Records_RelationsArgs = {
  _inc?: InputMaybe<Tags_Records_Relations_Inc_Input>;
  _set?: InputMaybe<Tags_Records_Relations_Set_Input>;
  where: Tags_Records_Relations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Tags_Records_Relations_By_PkArgs = {
  _inc?: InputMaybe<Tags_Records_Relations_Inc_Input>;
  _set?: InputMaybe<Tags_Records_Relations_Set_Input>;
  pk_columns: Tags_Records_Relations_Pk_Columns_Input;
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
  /** An array relationship */
  executions: Array<Executions>;
  /** An aggregate relationship */
  executions_aggregate: Executions_Aggregate;
  /** fetch data from the table: "executions" using primary key columns */
  executions_by_pk?: Maybe<Executions>;
  /** An array relationship */
  executions_connections: Array<Executions_Connections>;
  /** An aggregate relationship */
  executions_connections_aggregate: Executions_Connections_Aggregate;
  /** fetch data from the table: "executions_connections" using primary key columns */
  executions_connections_by_pk?: Maybe<Executions_Connections>;
  /** fetch data from the table: "records" */
  records: Array<Records>;
  /** fetch aggregated fields from the table: "records" */
  records_aggregate: Records_Aggregate;
  /** fetch data from the table: "records" using primary key columns */
  records_by_pk?: Maybe<Records>;
  /** fetch data from the table: "tags" */
  tags: Array<Tags>;
  /** fetch aggregated fields from the table: "tags" */
  tags_aggregate: Tags_Aggregate;
  /** fetch data from the table: "tags" using primary key columns */
  tags_by_pk?: Maybe<Tags>;
  /** An array relationship */
  tags_records_relations: Array<Tags_Records_Relations>;
  /** An aggregate relationship */
  tags_records_relations_aggregate: Tags_Records_Relations_Aggregate;
  /** fetch data from the table: "tags_records_relations" using primary key columns */
  tags_records_relations_by_pk?: Maybe<Tags_Records_Relations>;
};


export type Query_RootExecutionsArgs = {
  distinct_on?: InputMaybe<Array<Executions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Order_By>>;
  where?: InputMaybe<Executions_Bool_Exp>;
};


export type Query_RootExecutions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Executions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Order_By>>;
  where?: InputMaybe<Executions_Bool_Exp>;
};


export type Query_RootExecutions_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootExecutions_ConnectionsArgs = {
  distinct_on?: InputMaybe<Array<Executions_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Connections_Order_By>>;
  where?: InputMaybe<Executions_Connections_Bool_Exp>;
};


export type Query_RootExecutions_Connections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Executions_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Connections_Order_By>>;
  where?: InputMaybe<Executions_Connections_Bool_Exp>;
};


export type Query_RootExecutions_Connections_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootRecordsArgs = {
  distinct_on?: InputMaybe<Array<Records_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Records_Order_By>>;
  where?: InputMaybe<Records_Bool_Exp>;
};


export type Query_RootRecords_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Records_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Records_Order_By>>;
  where?: InputMaybe<Records_Bool_Exp>;
};


export type Query_RootRecords_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootTagsArgs = {
  distinct_on?: InputMaybe<Array<Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Order_By>>;
  where?: InputMaybe<Tags_Bool_Exp>;
};


export type Query_RootTags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Order_By>>;
  where?: InputMaybe<Tags_Bool_Exp>;
};


export type Query_RootTags_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootTags_Records_RelationsArgs = {
  distinct_on?: InputMaybe<Array<Tags_Records_Relations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Records_Relations_Order_By>>;
  where?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
};


export type Query_RootTags_Records_Relations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tags_Records_Relations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Records_Relations_Order_By>>;
  where?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
};


export type Query_RootTags_Records_Relations_By_PkArgs = {
  id: Scalars['Int'];
};

/** columns and relationships of "records" */
export type Records = {
  __typename?: 'records';
  active: Scalars['Boolean'];
  boundary: Scalars['String'];
  /** An array relationship */
  executions: Array<Executions>;
  /** An aggregate relationship */
  executions_aggregate: Executions_Aggregate;
  id: Scalars['Int'];
  label: Scalars['String'];
  periodicity: Scalars['Int'];
  /** An array relationship */
  tags_records_relations: Array<Tags_Records_Relations>;
  /** An aggregate relationship */
  tags_records_relations_aggregate: Tags_Records_Relations_Aggregate;
  url: Scalars['String'];
};


/** columns and relationships of "records" */
export type RecordsExecutionsArgs = {
  distinct_on?: InputMaybe<Array<Executions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Order_By>>;
  where?: InputMaybe<Executions_Bool_Exp>;
};


/** columns and relationships of "records" */
export type RecordsExecutions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Executions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Order_By>>;
  where?: InputMaybe<Executions_Bool_Exp>;
};


/** columns and relationships of "records" */
export type RecordsTags_Records_RelationsArgs = {
  distinct_on?: InputMaybe<Array<Tags_Records_Relations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Records_Relations_Order_By>>;
  where?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
};


/** columns and relationships of "records" */
export type RecordsTags_Records_Relations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tags_Records_Relations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Records_Relations_Order_By>>;
  where?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
};

/** aggregated selection of "records" */
export type Records_Aggregate = {
  __typename?: 'records_aggregate';
  aggregate?: Maybe<Records_Aggregate_Fields>;
  nodes: Array<Records>;
};

/** aggregate fields of "records" */
export type Records_Aggregate_Fields = {
  __typename?: 'records_aggregate_fields';
  avg?: Maybe<Records_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Records_Max_Fields>;
  min?: Maybe<Records_Min_Fields>;
  stddev?: Maybe<Records_Stddev_Fields>;
  stddev_pop?: Maybe<Records_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Records_Stddev_Samp_Fields>;
  sum?: Maybe<Records_Sum_Fields>;
  var_pop?: Maybe<Records_Var_Pop_Fields>;
  var_samp?: Maybe<Records_Var_Samp_Fields>;
  variance?: Maybe<Records_Variance_Fields>;
};


/** aggregate fields of "records" */
export type Records_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Records_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Records_Avg_Fields = {
  __typename?: 'records_avg_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "records". All fields are combined with a logical 'AND'. */
export type Records_Bool_Exp = {
  _and?: InputMaybe<Array<Records_Bool_Exp>>;
  _not?: InputMaybe<Records_Bool_Exp>;
  _or?: InputMaybe<Array<Records_Bool_Exp>>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  boundary?: InputMaybe<String_Comparison_Exp>;
  executions?: InputMaybe<Executions_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  periodicity?: InputMaybe<Int_Comparison_Exp>;
  tags_records_relations?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "records" */
export enum Records_Constraint {
  /** unique or primary key constraint */
  RecordsPkey = 'records_pkey'
}

/** input type for incrementing numeric columns in table "records" */
export type Records_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
  periodicity?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "records" */
export type Records_Insert_Input = {
  active?: InputMaybe<Scalars['Boolean']>;
  boundary?: InputMaybe<Scalars['String']>;
  executions?: InputMaybe<Executions_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']>;
  label?: InputMaybe<Scalars['String']>;
  periodicity?: InputMaybe<Scalars['Int']>;
  tags_records_relations?: InputMaybe<Tags_Records_Relations_Arr_Rel_Insert_Input>;
  url?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Records_Max_Fields = {
  __typename?: 'records_max_fields';
  boundary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['String']>;
  periodicity?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Records_Min_Fields = {
  __typename?: 'records_min_fields';
  boundary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['String']>;
  periodicity?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "records" */
export type Records_Mutation_Response = {
  __typename?: 'records_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Records>;
};

/** input type for inserting object relation for remote table "records" */
export type Records_Obj_Rel_Insert_Input = {
  data: Records_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Records_On_Conflict>;
};

/** on_conflict condition type for table "records" */
export type Records_On_Conflict = {
  constraint: Records_Constraint;
  update_columns?: Array<Records_Update_Column>;
  where?: InputMaybe<Records_Bool_Exp>;
};

/** Ordering options when selecting data from "records". */
export type Records_Order_By = {
  active?: InputMaybe<Order_By>;
  boundary?: InputMaybe<Order_By>;
  executions_aggregate?: InputMaybe<Executions_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  periodicity?: InputMaybe<Order_By>;
  tags_records_relations_aggregate?: InputMaybe<Tags_Records_Relations_Aggregate_Order_By>;
  url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: records */
export type Records_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "records" */
export enum Records_Select_Column {
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
  Url = 'url'
}

/** input type for updating data in table "records" */
export type Records_Set_Input = {
  active?: InputMaybe<Scalars['Boolean']>;
  boundary?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  label?: InputMaybe<Scalars['String']>;
  periodicity?: InputMaybe<Scalars['Int']>;
  url?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Records_Stddev_Fields = {
  __typename?: 'records_stddev_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Records_Stddev_Pop_Fields = {
  __typename?: 'records_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Records_Stddev_Samp_Fields = {
  __typename?: 'records_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Records_Sum_Fields = {
  __typename?: 'records_sum_fields';
  id?: Maybe<Scalars['Int']>;
  periodicity?: Maybe<Scalars['Int']>;
};

/** update columns of table "records" */
export enum Records_Update_Column {
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
  Url = 'url'
}

/** aggregate var_pop on columns */
export type Records_Var_Pop_Fields = {
  __typename?: 'records_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Records_Var_Samp_Fields = {
  __typename?: 'records_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Records_Variance_Fields = {
  __typename?: 'records_variance_fields';
  id?: Maybe<Scalars['Float']>;
  periodicity?: Maybe<Scalars['Float']>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** An array relationship */
  executions: Array<Executions>;
  /** An aggregate relationship */
  executions_aggregate: Executions_Aggregate;
  /** fetch data from the table: "executions" using primary key columns */
  executions_by_pk?: Maybe<Executions>;
  /** An array relationship */
  executions_connections: Array<Executions_Connections>;
  /** An aggregate relationship */
  executions_connections_aggregate: Executions_Connections_Aggregate;
  /** fetch data from the table: "executions_connections" using primary key columns */
  executions_connections_by_pk?: Maybe<Executions_Connections>;
  /** fetch data from the table: "records" */
  records: Array<Records>;
  /** fetch aggregated fields from the table: "records" */
  records_aggregate: Records_Aggregate;
  /** fetch data from the table: "records" using primary key columns */
  records_by_pk?: Maybe<Records>;
  /** fetch data from the table: "tags" */
  tags: Array<Tags>;
  /** fetch aggregated fields from the table: "tags" */
  tags_aggregate: Tags_Aggregate;
  /** fetch data from the table: "tags" using primary key columns */
  tags_by_pk?: Maybe<Tags>;
  /** An array relationship */
  tags_records_relations: Array<Tags_Records_Relations>;
  /** An aggregate relationship */
  tags_records_relations_aggregate: Tags_Records_Relations_Aggregate;
  /** fetch data from the table: "tags_records_relations" using primary key columns */
  tags_records_relations_by_pk?: Maybe<Tags_Records_Relations>;
};


export type Subscription_RootExecutionsArgs = {
  distinct_on?: InputMaybe<Array<Executions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Order_By>>;
  where?: InputMaybe<Executions_Bool_Exp>;
};


export type Subscription_RootExecutions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Executions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Order_By>>;
  where?: InputMaybe<Executions_Bool_Exp>;
};


export type Subscription_RootExecutions_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootExecutions_ConnectionsArgs = {
  distinct_on?: InputMaybe<Array<Executions_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Connections_Order_By>>;
  where?: InputMaybe<Executions_Connections_Bool_Exp>;
};


export type Subscription_RootExecutions_Connections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Executions_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Executions_Connections_Order_By>>;
  where?: InputMaybe<Executions_Connections_Bool_Exp>;
};


export type Subscription_RootExecutions_Connections_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootRecordsArgs = {
  distinct_on?: InputMaybe<Array<Records_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Records_Order_By>>;
  where?: InputMaybe<Records_Bool_Exp>;
};


export type Subscription_RootRecords_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Records_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Records_Order_By>>;
  where?: InputMaybe<Records_Bool_Exp>;
};


export type Subscription_RootRecords_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootTagsArgs = {
  distinct_on?: InputMaybe<Array<Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Order_By>>;
  where?: InputMaybe<Tags_Bool_Exp>;
};


export type Subscription_RootTags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Order_By>>;
  where?: InputMaybe<Tags_Bool_Exp>;
};


export type Subscription_RootTags_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootTags_Records_RelationsArgs = {
  distinct_on?: InputMaybe<Array<Tags_Records_Relations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Records_Relations_Order_By>>;
  where?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
};


export type Subscription_RootTags_Records_Relations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tags_Records_Relations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Records_Relations_Order_By>>;
  where?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
};


export type Subscription_RootTags_Records_Relations_By_PkArgs = {
  id: Scalars['Int'];
};

/** columns and relationships of "tags" */
export type Tags = {
  __typename?: 'tags';
  id: Scalars['Int'];
  tag_name: Scalars['String'];
  /** An array relationship */
  tags_records_relations: Array<Tags_Records_Relations>;
  /** An aggregate relationship */
  tags_records_relations_aggregate: Tags_Records_Relations_Aggregate;
};


/** columns and relationships of "tags" */
export type TagsTags_Records_RelationsArgs = {
  distinct_on?: InputMaybe<Array<Tags_Records_Relations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Records_Relations_Order_By>>;
  where?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
};


/** columns and relationships of "tags" */
export type TagsTags_Records_Relations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tags_Records_Relations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Records_Relations_Order_By>>;
  where?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
};

/** aggregated selection of "tags" */
export type Tags_Aggregate = {
  __typename?: 'tags_aggregate';
  aggregate?: Maybe<Tags_Aggregate_Fields>;
  nodes: Array<Tags>;
};

/** aggregate fields of "tags" */
export type Tags_Aggregate_Fields = {
  __typename?: 'tags_aggregate_fields';
  avg?: Maybe<Tags_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Tags_Max_Fields>;
  min?: Maybe<Tags_Min_Fields>;
  stddev?: Maybe<Tags_Stddev_Fields>;
  stddev_pop?: Maybe<Tags_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Tags_Stddev_Samp_Fields>;
  sum?: Maybe<Tags_Sum_Fields>;
  var_pop?: Maybe<Tags_Var_Pop_Fields>;
  var_samp?: Maybe<Tags_Var_Samp_Fields>;
  variance?: Maybe<Tags_Variance_Fields>;
};


/** aggregate fields of "tags" */
export type Tags_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Tags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Tags_Avg_Fields = {
  __typename?: 'tags_avg_fields';
  id?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "tags". All fields are combined with a logical 'AND'. */
export type Tags_Bool_Exp = {
  _and?: InputMaybe<Array<Tags_Bool_Exp>>;
  _not?: InputMaybe<Tags_Bool_Exp>;
  _or?: InputMaybe<Array<Tags_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  tag_name?: InputMaybe<String_Comparison_Exp>;
  tags_records_relations?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
};

/** unique or primary key constraints on table "tags" */
export enum Tags_Constraint {
  /** unique or primary key constraint */
  TagsPkey = 'tags_pkey',
  /** unique or primary key constraint */
  TagsTagNameKey = 'tags_tag_name_key'
}

/** input type for incrementing numeric columns in table "tags" */
export type Tags_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "tags" */
export type Tags_Insert_Input = {
  id?: InputMaybe<Scalars['Int']>;
  tag_name?: InputMaybe<Scalars['String']>;
  tags_records_relations?: InputMaybe<Tags_Records_Relations_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Tags_Max_Fields = {
  __typename?: 'tags_max_fields';
  id?: Maybe<Scalars['Int']>;
  tag_name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Tags_Min_Fields = {
  __typename?: 'tags_min_fields';
  id?: Maybe<Scalars['Int']>;
  tag_name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "tags" */
export type Tags_Mutation_Response = {
  __typename?: 'tags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Tags>;
};

/** input type for inserting object relation for remote table "tags" */
export type Tags_Obj_Rel_Insert_Input = {
  data: Tags_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Tags_On_Conflict>;
};

/** on_conflict condition type for table "tags" */
export type Tags_On_Conflict = {
  constraint: Tags_Constraint;
  update_columns?: Array<Tags_Update_Column>;
  where?: InputMaybe<Tags_Bool_Exp>;
};

/** Ordering options when selecting data from "tags". */
export type Tags_Order_By = {
  id?: InputMaybe<Order_By>;
  tag_name?: InputMaybe<Order_By>;
  tags_records_relations_aggregate?: InputMaybe<Tags_Records_Relations_Aggregate_Order_By>;
};

/** primary key columns input for table: tags */
export type Tags_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** columns and relationships of "tags_records_relations" */
export type Tags_Records_Relations = {
  __typename?: 'tags_records_relations';
  id: Scalars['Int'];
  /** An object relationship */
  record: Records;
  record_id: Scalars['Int'];
  /** An object relationship */
  tag: Tags;
  tag_id: Scalars['Int'];
};

/** aggregated selection of "tags_records_relations" */
export type Tags_Records_Relations_Aggregate = {
  __typename?: 'tags_records_relations_aggregate';
  aggregate?: Maybe<Tags_Records_Relations_Aggregate_Fields>;
  nodes: Array<Tags_Records_Relations>;
};

/** aggregate fields of "tags_records_relations" */
export type Tags_Records_Relations_Aggregate_Fields = {
  __typename?: 'tags_records_relations_aggregate_fields';
  avg?: Maybe<Tags_Records_Relations_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Tags_Records_Relations_Max_Fields>;
  min?: Maybe<Tags_Records_Relations_Min_Fields>;
  stddev?: Maybe<Tags_Records_Relations_Stddev_Fields>;
  stddev_pop?: Maybe<Tags_Records_Relations_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Tags_Records_Relations_Stddev_Samp_Fields>;
  sum?: Maybe<Tags_Records_Relations_Sum_Fields>;
  var_pop?: Maybe<Tags_Records_Relations_Var_Pop_Fields>;
  var_samp?: Maybe<Tags_Records_Relations_Var_Samp_Fields>;
  variance?: Maybe<Tags_Records_Relations_Variance_Fields>;
};


/** aggregate fields of "tags_records_relations" */
export type Tags_Records_Relations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Tags_Records_Relations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "tags_records_relations" */
export type Tags_Records_Relations_Aggregate_Order_By = {
  avg?: InputMaybe<Tags_Records_Relations_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Tags_Records_Relations_Max_Order_By>;
  min?: InputMaybe<Tags_Records_Relations_Min_Order_By>;
  stddev?: InputMaybe<Tags_Records_Relations_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Tags_Records_Relations_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Tags_Records_Relations_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Tags_Records_Relations_Sum_Order_By>;
  var_pop?: InputMaybe<Tags_Records_Relations_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Tags_Records_Relations_Var_Samp_Order_By>;
  variance?: InputMaybe<Tags_Records_Relations_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "tags_records_relations" */
export type Tags_Records_Relations_Arr_Rel_Insert_Input = {
  data: Array<Tags_Records_Relations_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Tags_Records_Relations_On_Conflict>;
};

/** aggregate avg on columns */
export type Tags_Records_Relations_Avg_Fields = {
  __typename?: 'tags_records_relations_avg_fields';
  id?: Maybe<Scalars['Float']>;
  record_id?: Maybe<Scalars['Float']>;
  tag_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "tags_records_relations" */
export type Tags_Records_Relations_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "tags_records_relations". All fields are combined with a logical 'AND'. */
export type Tags_Records_Relations_Bool_Exp = {
  _and?: InputMaybe<Array<Tags_Records_Relations_Bool_Exp>>;
  _not?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
  _or?: InputMaybe<Array<Tags_Records_Relations_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  record?: InputMaybe<Records_Bool_Exp>;
  record_id?: InputMaybe<Int_Comparison_Exp>;
  tag?: InputMaybe<Tags_Bool_Exp>;
  tag_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "tags_records_relations" */
export enum Tags_Records_Relations_Constraint {
  /** unique or primary key constraint */
  TagsRecordsRelationsPkey = 'tags_records_relations_pkey'
}

/** input type for incrementing numeric columns in table "tags_records_relations" */
export type Tags_Records_Relations_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
  record_id?: InputMaybe<Scalars['Int']>;
  tag_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "tags_records_relations" */
export type Tags_Records_Relations_Insert_Input = {
  id?: InputMaybe<Scalars['Int']>;
  record?: InputMaybe<Records_Obj_Rel_Insert_Input>;
  record_id?: InputMaybe<Scalars['Int']>;
  tag?: InputMaybe<Tags_Obj_Rel_Insert_Input>;
  tag_id?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Tags_Records_Relations_Max_Fields = {
  __typename?: 'tags_records_relations_max_fields';
  id?: Maybe<Scalars['Int']>;
  record_id?: Maybe<Scalars['Int']>;
  tag_id?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "tags_records_relations" */
export type Tags_Records_Relations_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Tags_Records_Relations_Min_Fields = {
  __typename?: 'tags_records_relations_min_fields';
  id?: Maybe<Scalars['Int']>;
  record_id?: Maybe<Scalars['Int']>;
  tag_id?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "tags_records_relations" */
export type Tags_Records_Relations_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "tags_records_relations" */
export type Tags_Records_Relations_Mutation_Response = {
  __typename?: 'tags_records_relations_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Tags_Records_Relations>;
};

/** on_conflict condition type for table "tags_records_relations" */
export type Tags_Records_Relations_On_Conflict = {
  constraint: Tags_Records_Relations_Constraint;
  update_columns?: Array<Tags_Records_Relations_Update_Column>;
  where?: InputMaybe<Tags_Records_Relations_Bool_Exp>;
};

/** Ordering options when selecting data from "tags_records_relations". */
export type Tags_Records_Relations_Order_By = {
  id?: InputMaybe<Order_By>;
  record?: InputMaybe<Records_Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag?: InputMaybe<Tags_Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: tags_records_relations */
export type Tags_Records_Relations_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "tags_records_relations" */
export enum Tags_Records_Relations_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  RecordId = 'record_id',
  /** column name */
  TagId = 'tag_id'
}

/** input type for updating data in table "tags_records_relations" */
export type Tags_Records_Relations_Set_Input = {
  id?: InputMaybe<Scalars['Int']>;
  record_id?: InputMaybe<Scalars['Int']>;
  tag_id?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Tags_Records_Relations_Stddev_Fields = {
  __typename?: 'tags_records_relations_stddev_fields';
  id?: Maybe<Scalars['Float']>;
  record_id?: Maybe<Scalars['Float']>;
  tag_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "tags_records_relations" */
export type Tags_Records_Relations_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Tags_Records_Relations_Stddev_Pop_Fields = {
  __typename?: 'tags_records_relations_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
  record_id?: Maybe<Scalars['Float']>;
  tag_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "tags_records_relations" */
export type Tags_Records_Relations_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Tags_Records_Relations_Stddev_Samp_Fields = {
  __typename?: 'tags_records_relations_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
  record_id?: Maybe<Scalars['Float']>;
  tag_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "tags_records_relations" */
export type Tags_Records_Relations_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Tags_Records_Relations_Sum_Fields = {
  __typename?: 'tags_records_relations_sum_fields';
  id?: Maybe<Scalars['Int']>;
  record_id?: Maybe<Scalars['Int']>;
  tag_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "tags_records_relations" */
export type Tags_Records_Relations_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** update columns of table "tags_records_relations" */
export enum Tags_Records_Relations_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  RecordId = 'record_id',
  /** column name */
  TagId = 'tag_id'
}

/** aggregate var_pop on columns */
export type Tags_Records_Relations_Var_Pop_Fields = {
  __typename?: 'tags_records_relations_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
  record_id?: Maybe<Scalars['Float']>;
  tag_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "tags_records_relations" */
export type Tags_Records_Relations_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Tags_Records_Relations_Var_Samp_Fields = {
  __typename?: 'tags_records_relations_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
  record_id?: Maybe<Scalars['Float']>;
  tag_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "tags_records_relations" */
export type Tags_Records_Relations_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Tags_Records_Relations_Variance_Fields = {
  __typename?: 'tags_records_relations_variance_fields';
  id?: Maybe<Scalars['Float']>;
  record_id?: Maybe<Scalars['Float']>;
  tag_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "tags_records_relations" */
export type Tags_Records_Relations_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** select columns of table "tags" */
export enum Tags_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  TagName = 'tag_name'
}

/** input type for updating data in table "tags" */
export type Tags_Set_Input = {
  id?: InputMaybe<Scalars['Int']>;
  tag_name?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Tags_Stddev_Fields = {
  __typename?: 'tags_stddev_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Tags_Stddev_Pop_Fields = {
  __typename?: 'tags_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Tags_Stddev_Samp_Fields = {
  __typename?: 'tags_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Tags_Sum_Fields = {
  __typename?: 'tags_sum_fields';
  id?: Maybe<Scalars['Int']>;
};

/** update columns of table "tags" */
export enum Tags_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  TagName = 'tag_name'
}

/** aggregate var_pop on columns */
export type Tags_Var_Pop_Fields = {
  __typename?: 'tags_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Tags_Var_Samp_Fields = {
  __typename?: 'tags_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Tags_Variance_Fields = {
  __typename?: 'tags_variance_fields';
  id?: Maybe<Scalars['Float']>;
};

export type AllRecordsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllRecordsQuery = { __typename?: 'query_root', records: Array<{ __typename?: 'records', id: number, active: boolean, boundary: string, label: string, periodicity: number, url: string }> };

export type AllRecordsDataQueryVariables = Exact<{ [key: string]: never; }>;


export type AllRecordsDataQuery = { __typename?: 'query_root', records: Array<{ __typename?: 'records', id: number, label: string, boundary: string, active: boolean, periodicity: number, url: string, tags_records_relations: Array<{ __typename?: 'tags_records_relations', tag: { __typename?: 'tags', tag_name: string, id: number } }> }> };

export type InsertRecordMutationVariables = Exact<{
  url?: InputMaybe<Scalars['String']>;
  periodicity?: InputMaybe<Scalars['Int']>;
  label?: InputMaybe<Scalars['String']>;
  boundary?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
}>;


export type InsertRecordMutation = { __typename?: 'mutation_root', insert_records_one?: { __typename?: 'records', id: number } | null };

export type UpdateRecordMutationVariables = Exact<{
  id?: InputMaybe<Scalars['Int']>;
  active?: InputMaybe<Scalars['Boolean']>;
  boundary?: InputMaybe<Scalars['String']>;
  label?: InputMaybe<Scalars['String']>;
  periodicity?: InputMaybe<Scalars['Int']>;
  url?: InputMaybe<Scalars['String']>;
}>;


export type UpdateRecordMutation = { __typename?: 'mutation_root', update_records_by_pk?: { __typename?: 'records', id: number } | null };

export type GetRecordQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']>;
}>;


export type GetRecordQuery = { __typename?: 'query_root', records_by_pk?: { __typename?: 'records', active: boolean, boundary: string, id: number, label: string, periodicity: number, url: string } | null };

export type InsertTagMutationVariables = Exact<{
  tag_name?: InputMaybe<Scalars['String']>;
}>;


export type InsertTagMutation = { __typename?: 'mutation_root', insert_tags_one?: { __typename?: 'tags', id: number } | null };

export type AllTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllTagsQuery = { __typename?: 'query_root', tags: Array<{ __typename?: 'tags', id: number, tag_name: string }> };


export const AllRecordsDocument = gql`
    query AllRecords {
  records {
    id
    active
    boundary
    label
    periodicity
    url
  }
}
    `;

export function useAllRecordsQuery(options: Omit<Urql.UseQueryArgs<never, AllRecordsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<AllRecordsQuery>({ query: AllRecordsDocument, ...options });
};
export const AllRecordsDataDocument = gql`
    query AllRecordsData {
  records {
    id
    label
    boundary
    active
    periodicity
    url
    tags_records_relations {
      tag {
        tag_name
        id
      }
    }
  }
}
    `;

export function useAllRecordsDataQuery(options: Omit<Urql.UseQueryArgs<never, AllRecordsDataQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<AllRecordsDataQuery>({ query: AllRecordsDataDocument, ...options });
};
export const InsertRecordDocument = gql`
    mutation InsertRecord($url: String = "", $periodicity: Int = 10, $label: String = "", $boundary: String = "", $active: Boolean = false) {
  insert_records_one(
    object: {active: $active, boundary: $boundary, label: $label, periodicity: $periodicity, url: $url}
  ) {
    id
  }
}
    `;

export function useInsertRecordMutation() {
  return Urql.useMutation<InsertRecordMutation, InsertRecordMutationVariables>(InsertRecordDocument);
};
export const UpdateRecordDocument = gql`
    mutation UpdateRecord($id: Int = 10, $active: Boolean = false, $boundary: String = "", $label: String = "", $periodicity: Int = 10, $url: String = "") {
  update_records_by_pk(
    pk_columns: {id: $id}
    _set: {active: $active, boundary: $boundary, label: $label, url: $url, periodicity: $periodicity}
  ) {
    id
  }
}
    `;

export function useUpdateRecordMutation() {
  return Urql.useMutation<UpdateRecordMutation, UpdateRecordMutationVariables>(UpdateRecordDocument);
};
export const GetRecordDocument = gql`
    query GetRecord($id: Int = 10) {
  records_by_pk(id: $id) {
    active
    boundary
    id
    label
    periodicity
    url
  }
}
    `;

export function useGetRecordQuery(options: Omit<Urql.UseQueryArgs<never, GetRecordQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetRecordQuery>({ query: GetRecordDocument, ...options });
};
export const InsertTagDocument = gql`
    mutation InsertTag($tag_name: String = "") {
  insert_tags_one(object: {tag_name: $tag_name}) {
    id
  }
}
    `;

export function useInsertTagMutation() {
  return Urql.useMutation<InsertTagMutation, InsertTagMutationVariables>(InsertTagDocument);
};
export const AllTagsDocument = gql`
    query AllTags {
  tags {
    id
    tag_name
  }
}
    `;

export function useAllTagsQuery(options: Omit<Urql.UseQueryArgs<never, AllTagsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<AllTagsQuery>({ query: AllTagsDocument, ...options });
};