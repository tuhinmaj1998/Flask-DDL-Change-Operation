import pandas as pd
import psycopg2
import pandas.io.sql as psql
inf_schema_details_table = 'information_schema.columns'


def create_conn():
    conn = psycopg2.connect(host="localhost",
                                   user="tuhinmajumder",
                                   password="162216",
                                   port = 5432,
                                   dbname="tuhinmajumder")

    return conn


def fetchdata_from_redshift(schema, tablename):
    conn = create_conn()
    query_string = f"""
    select table_catalog,
    table_schema,table_name,column_name,ordinal_position,column_default,is_nullable,data_type,
    character_maximum_length,character_octet_length,numeric_precision,numeric_precision_radix,
    numeric_scale,datetime_precision,interval_type,interval_precision,character_set_catalog,
    character_set_schema,character_set_name,collation_catalog,collation_schema,collation_name,
    domain_catalog,domain_schema,domain_name,udt_catalog,udt_schema,udt_name,scope_catalog,scope_schema,
    scope_name,maximum_cardinality,dtd_identifier,is_self_referencing
    from {inf_schema_details_table} where table_schema = '{schema}' and table_name = '{tablename}';"""
    # print(query_string)
    cursor = conn.cursor()
    # cursor.execute(query_string)
    results = psql.read_sql(query_string, conn)
    # results: pd.DataFrame = cursor.fetch_dataframe()
    cursor.close()
    conn.close()

    # print(results)
    return results


def fetch_all_schema():
    conn = create_conn()
    query_string = f"""
    select distinct table_schema 
    from {inf_schema_details_table}
    where table_schema not in ('pg_automv', 'pg_catalog', 'information_schema', 'reporting')
    order by table_schema;"""
    # print(query_string)
    cursor = conn.cursor()
    # cursor.execute(query_string)
    results = psql.read_sql(query_string, conn)
    # results: pd.DataFrame = cursor.fetch_dataframe()

    schema_return = [('', '')]
    for index, row in results.iterrows():
        schema_return.append((row['table_schema'], row['table_schema']))
    cursor.close()
    conn.close()

    # print(schema_return)
    return schema_return


# fetch_all_schema()

def fetch_tablenames(schema):
    conn = create_conn()
    query_string = f"""
    select distinct table_name
    from {inf_schema_details_table} 
    where table_schema = '{schema}'
    order by table_name;"""
    # print(query_string)
    cursor = conn.cursor()
    # cursor.execute(query_string)
    results = psql.read_sql(query_string, conn)
    # results: pd.DataFrame = cursor.fetch_dataframe()
    table_return = []
    for index, row in results.iterrows():
        table_return.append((row['table_name'], row['table_name']))
    cursor.close()
    conn.close()

    # print(table_return)
    return table_return


# fetch_tablenames('prestage')


def fetch_tablename_dict(schema):
    conn = create_conn()
    query_string = f"""
    select distinct table_name
    from {inf_schema_details_table} 
    where table_schema = '{schema}'
    order by table_name;"""
    # print(query_string)
    cursor = conn.cursor()
    # cursor.execute(query_string)
    results = psql.read_sql(query_string, conn)
    # results: pd.DataFrame = cursor.fetch_dataframe()

    tablename_list = []
    for index, row in results.iterrows():
        tablename_list.append({'index': row['table_name'], 'table_name': row['table_name']})
    cursor.close()
    conn.close()
    # print(tablename_list)
    return list(tablename_list)


# fetch_tablename_dict('prestage')


def fetch_columnnames(schema, tablename):
    conn = create_conn()
    query_string = f"""
    select distinct column_name
    from {inf_schema_details_table} 
    where table_schema = '{schema}' and table_name='{tablename}'
    order by column_name;"""
    # print(query_string)
    cursor = conn.cursor()
    # cursor.execute(query_string)
    results = psql.read_sql(query_string, conn)
    # results: pd.DataFrame = cursor.fetch_dataframe()
    column_return = []
    for index, row in results.iterrows():
        column_return.append((row['column_name'], row['column_name']))
    cursor.close()
    conn.close()

    # print(column_return)
    return column_return


def fetch_columnname_dict(schema, tablename):
    conn = create_conn()
    query_string = f"""
    select distinct column_name
    from {inf_schema_details_table} 
    where table_schema = '{schema}' and table_name='{tablename}'
    order by column_name;"""
    # print(query_string)
    cursor = conn.cursor()
    # cursor.execute(query_string)
    results = psql.read_sql(query_string, conn)
    # results: pd.DataFrame = cursor.fetch_dataframe()
    columnname_list = []
    for index, row in results.iterrows():
        columnname_list.append({'index': row['column_name'], 'column_name': row['column_name']})
    cursor.close()
    conn.close()
    # print(columnname_list)
    return list(columnname_list)


# fetch_columnnames('prestage','master_makt')
# fetch_columnname_dict('prestage','master_makt')


def fetch_column_details(schema, tablename, columnname):
    import urllib.parse
    columnname = columnname.replace('%2g', '%2F')
    columnname = (urllib.parse.unquote_plus(columnname))
    query_string = f"""
    select table_catalog,
    table_schema,table_name,column_name,ordinal_position,column_default,is_nullable,data_type,
    character_maximum_length,character_octet_length,numeric_precision,numeric_precision_radix,
    numeric_scale,datetime_precision,interval_type,interval_precision,character_set_catalog,
    character_set_schema,character_set_name,collation_catalog,collation_schema,collation_name,
    domain_catalog,domain_schema,domain_name,udt_catalog,udt_schema,udt_name,scope_catalog,scope_schema,
    scope_name,maximum_cardinality,dtd_identifier,is_self_referencing
    from {inf_schema_details_table} 
    where table_schema = '{schema}' and table_name='{tablename}' and column_name='{columnname}';"""
    print(query_string)
    conn = create_conn()
    cursor = conn.cursor()
    # cursor.execute(query_string)
    results = psql.read_sql(query_string, conn)
    # results: pd.DataFrame = cursor.fetch_dataframe()
    res_json = results.to_json(orient="records")
    # return res_json
    column_details_dict = {}
    # print(results.T)
    cursor.close()
    conn.close()
    res_dict = results.T.to_dict()[0]
    return res_dict


def extract_cdata_type(result_dict):
    dtype = ''
    if result_dict['data_type'] == 'character varying':
        dtype = result_dict['data_type'] + '(' + str(result_dict['character_maximum_length']) + ')'
    elif result_dict['data_type'] == 'numeric':
        dtype = result_dict['data_type'] + '(' + str(result_dict['numeric_precision']) + ',' + str(
            result_dict['numeric_scale']) + ')'
    #
    # elif a['data_type'] == 'timestamp without time zone':
    #     dtype = a['data_type']
    else:
        # bigint
        dtype = result_dict['data_type']
    return dtype


# print(fetch_column_details('proplayer1','t_p1_f_production_afvv', 'activitylogid'))


def verify_op(verify_dict_):
    issue_count = 0
    issue_dict = {}

    verify_dict = eval(verify_dict_)
    print(verify_dict)
    for key, value in verify_dict.items():
        schema = value["schema"]
        table = value["table"]
        columnname = value["columnname"]
        oldcolumnname = value["oldcolumnname"]
        datatype = value["datatype"]
        lastchangedatatype = value["lastchangedatatype"]
        operation = value["operation"]

        if operation == 'edit':
            if columnname == oldcolumnname:
                if datatype == lastchangedatatype or lastchangedatatype == "":
                    issue_message = f'{datatype} is already assigned for <{columnname}> ({datatype}) in {schema} -> {table}. Kindly change the datatype to validate the edit operation'
                    verify_dict[key]['issue'] = issue_message
                    issue_count = issue_count + 1
                    issue_dict[key] = issue_message
                else:
                    verify_dict[key]['issue'] = ''
                    issue_dict[key] = ''
            else:
                validate_columnname(schema, table, columnname, verify_dict, key, issue_dict, issue_count)
                # print('')

        elif operation == 'add':
            if columnname == '':
                issue_message = f'Column Name cannot be empty!'
                verify_dict[key]['issue'] = issue_message
                issue_dict[key] = issue_message
                issue_count = issue_count + 1
            else:
                validate_columnname(schema, table, columnname, verify_dict, key, issue_dict, issue_count)

        elif operation == 'delete':
            verify_dict[key]['issue'] = ''
            issue_dict[key] = ''

    return issue_dict


def validate_columnname(schema, table, columnname, verify_dict, key, issue_dict, issue_count):
    special_characters = """!@#$%^&*(){}[]+?=,<>/"""
    if any(c in special_characters for c in columnname):
        spc = ''
        for c in columnname:
            if c in special_characters:
                spc = spc + c + ' '
        issue_message = f' Column Name cannot contain <{spc}> special characters!'
        verify_dict[key]['issue'] = issue_message
        issue_dict[key] = issue_message
        issue_count = issue_count + 1
    else:
        conn = create_conn()
        query_string = f"""select count(*) from {inf_schema_details_table} 
                                            where table_schema = '{schema}' and table_name='{table}' and column_name='{columnname}'"""
        # print(query_string)
        cursor = conn.cursor()
        cursor.execute(query_string)
        c_count = cursor.fetchone()[0]
        print(c_count)
        cursor.close()
        conn.close()

        if c_count > 0:
            issue_message = f' Already <{columnname}> column is present inside {schema} -> {table}!'
            verify_dict[key]['issue'] = issue_message
            issue_dict[key] = issue_message
            issue_count = issue_count + 1
        else:
            verify_dict[key]['issue'] = ''
            issue_dict[key] = ''


# verify_op('''{'newcolumnplus_prestage_finance_acdoca1': {'schema': 'prestage', 'table': 'finance_acdoca', 'columnname': 'accas', 'datatype': '', 'lastchangedatatype': 'character varying(2)', 'operation': 'add'}}''')
# print(verify_dict)

# def submit_createdml(verify_dict):
#     for key, value in verify_dict.items():
#         schema = value["schema"]
#         table = value["table"]
#         columnname = value["columnname"]
#         datatype = value["datatype"]
#         lastchangedatatype = value["lastchangedatatype"]
#         operation = value["operation"]
#     print('')


def validate_operation(perform_dict_, perform_flag):
    import time
    # time.sleep(3)
    query_list = []
    qlist_to_text = ''
    issue_count = 0
    issue_dict = verify_op(perform_dict_)
    # print('issue_dict: ', issue_dict)

    for (key, value) in issue_dict.items():
        if value != '':
            issue_count = issue_count + 1

    if issue_count == 0:
        perform_dict = eval(perform_dict_)
        for key, value in perform_dict.items():
            schema = value["schema"]
            table = value["table"]
            columnname = value["columnname"]
            oldcolumnname = value["oldcolumnname"]
            datatype = value["datatype"]
            lastchangedatatype = value["lastchangedatatype"]
            operation = value["operation"]
            temp_new_columnname = f'new_column_{int((time.time()))}'
            if operation == 'edit':

                if columnname == oldcolumnname:
                    query_header = f'''Edit Datatype Operation: "{schema}"."{table}"."{oldcolumnname}" ({datatype}) -> "{schema}"."{table}"."{columnname}" ({lastchangedatatype})'''
                    query_command1 = f'''ALTER TABLE "{schema}"."{table}" ADD COLUMN "{temp_new_columnname}" {lastchangedatatype};'''
                    query_command2 = f'''UPDATE "{schema}"."{table}" SET "{temp_new_columnname}" = "{columnname}";'''
                    query_command3 = f'''ALTER TABLE "{schema}"."{table}" DROP COLUMN "{columnname}";'''
                    query_command4 = f'''ALTER TABLE "{schema}"."{table}" RENAME COLUMN "{temp_new_columnname}" TO "{columnname}";'''

                    query_list.append(query_command1)
                    qlist_to_text = qlist_to_text + '<br><b>' + query_header + '</b>'
                    qlist_to_text = qlist_to_text + '<br>' + query_command1
                    query_list.append(query_command2)
                    qlist_to_text = qlist_to_text + '<br>' + query_command2
                    query_list.append(query_command3)
                    qlist_to_text = qlist_to_text + '<br>' + query_command3
                    query_list.append(query_command4)
                    qlist_to_text = qlist_to_text + '<br>' + query_command4
                else:
                    if datatype == lastchangedatatype:
                        query_header = f'''Rename Column Name Operation: "{schema}"."{table}"."{oldcolumnname}" ({datatype}) -> "{schema}"."{table}"."{columnname}" ({lastchangedatatype})'''
                        query_command1 = f'''ALTER TABLE "{schema}"."{table}" RENAME COLUMN "{oldcolumnname}" TO "{columnname}";'''
                        query_list.append(query_command1)
                        qlist_to_text = qlist_to_text + '<br><b>' + query_header + '</b>'
                        qlist_to_text = qlist_to_text + '<br>' + query_command1
                    else:
                        query_header = f'''Rename Column Name and Edit Datatype Operation: "{schema}"."{table}"."{oldcolumnname}" ({datatype}) -> "{schema}"."{table}"."{columnname}" ({lastchangedatatype})'''
                        query_command1 = f'''ALTER TABLE "{schema}"."{table}" ADD COLUMN "{columnname}" {lastchangedatatype};'''
                        query_command2 = f'''UPDATE "{schema}"."{table}" SET "{columnname}" = "{oldcolumnname}";'''
                        query_command3 = f'''ALTER TABLE "{schema}"."{table}" DROP COLUMN "{oldcolumnname}";'''

                        query_list.append(query_command1)
                        qlist_to_text = qlist_to_text + '<br><b>' + query_header + '</b>'
                        qlist_to_text = qlist_to_text + '<br>' + query_command1
                        query_list.append(query_command2)
                        qlist_to_text = qlist_to_text + '<br>' + query_command2
                        query_list.append(query_command3)
                        qlist_to_text = qlist_to_text + '<br>' + query_command3

            elif operation == 'add':
                query_header = f'''Add New Column Operation: "{schema}"."{table}"."{columnname}" ({lastchangedatatype})'''
                query_command1 = f'''ALTER TABLE "{schema}"."{table}" ADD COLUMN "{columnname}" {lastchangedatatype};'''

                query_list.append(query_command1)
                qlist_to_text = qlist_to_text + '<br><b>' + query_header + '</b>'
                qlist_to_text = qlist_to_text + '<br>' + query_command1

            elif operation == 'delete':
                query_header = f'''Delete Column Operation: "{schema}"."{table}"."{columnname}" ({datatype})'''
                query_command1 = f'''ALTER TABLE "{schema}"."{table}" DROP COLUMN "{columnname}";'''

                query_list.append(query_command1)
                qlist_to_text = qlist_to_text + '<br><b>' + query_header + '</b>'
                qlist_to_text = qlist_to_text + '<br>' + query_command1

            else:
                print('Something went wrong!')



        if len(query_list) > 0 and perform_flag == 1:
            conn = create_conn()
            cursor = conn.cursor()
            for ql in query_list:
                cursor.execute(ql)
                conn.commit()
            conn.close()
            return 'OK'
        else:
            print(qlist_to_text.replace('<br>', '\n').replace('<b>', '').replace('</b>', ''))
            return qlist_to_text
    else:
        return 'Something went wrong in this below operation! Kindly check!<br>' + perform_dict_
