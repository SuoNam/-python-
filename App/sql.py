from  pymysql import Connect
from datetime import datetime
class mysql(object):
    m_conn=None
    m_cursor=None
    def build_sql(self):#建库以及选库
        conn = Connect(
            host="localhost",
            port=3306,
            user="root",
            password="iBC:EY3Cegh;",
            autocommit=True,
        )
        # 数据库建立
        cursor = conn.cursor()
        self.m_cursor=cursor
        self.m_conn=conn
        dbname = "normal_account"
        try:
            self.m_cursor.execute("create database {}".format(dbname))
        except:
            print("数据库已存在")
        self.m_conn.select_db(dbname)

    def build_student_test(self):#建表--被试表
        try:
            self.m_cursor.execute(
                "create table student_test( id varchar(12), 主试 varchar(10),被试 varchar(10), 被试学号 varchar(20), 实验时间 datetime,实验地点 varchar(20),实验名称 varchar(50),实验材料 varchar(50),被试费 varchar(10),导师 varchar(20))")
        except:
            print("数据表已存在")
    def select_sql_id_test(self, student_id):#新版本--被试表--查找
        self.m_cursor.execute(f"select * from student_test where  id='{student_id}'")
        event = self.m_cursor.fetchall()
        l_msg = []
        if event != ():
            for i in event:
                d_msg = {}
                d_msg["experimenter"] = i[1]
                d_msg["participant"] = i[2]
                d_msg["id"] = i[3]
                d_msg["time"] = i[4].strftime("%Y-%m-%d")
                d_msg["location"] = i[5]
                d_msg["experiment"] = i[6]
                d_msg["material"] = i[7]
                d_msg["fee"]=i[8]
                d_msg["mentor"]=i[9]
                l_msg.append(d_msg)
            return l_msg
        else:
            return []
    def select_sql_id_test_time(self,student_id,startDate,endDate):#新版本--被试表--查找--时间
        self.m_cursor.execute(f"select * from student_test where 实验时间 between '{startDate}' and '{endDate}' and id='{student_id}'")
        event = self.m_cursor.fetchall()
        l_msg = []
        if event != ():
            for i in event:
                d_msg = {}
                d_msg["experimenter"] = i[1]
                d_msg["participant"] = i[2]
                d_msg["id"] = i[3]
                d_msg["time"] = i[4].strftime("%Y-%m-%d")
                d_msg["location"] = i[5]
                d_msg["experiment"] = i[6]
                d_msg["material"] = i[7]
                d_msg["fee"]=i[8]
                d_msg["mentor"]=i[9]
                l_msg.append(d_msg)
            return l_msg
        else:
            return []
    def inser_id(self,id,head,data):#增填数据--被试表
        if any(d==None for d in data[1:]):
            return 0
        try:
          query = f"INSERT INTO student_test (id, {head[0]}, {head[1]}, {head[2]}, {head[3]}, {head[4]}, {head[5]}, {head[6]}, {head[7]},{head[8]}) VALUES (%s,%s , %s, %s, %s, %s, %s, %s, %s, %s)"
          self.m_cursor.execute(query, (id,
            data[0],
            data[1],
            data[2],
            data[3],
            data[4],
            data[5],
            data[6],
            data[7],
            data[8]
          ))
        except OSError as e:
            print(e)
            return -1
        else:
            return 1
    def build_table_pre_id(self):#建表--预用户密码表
        try:
            self.m_cursor.execute(
                "create table pre_exit_id( name varchar(10),id varchar(12), password varchar(40),phone_number varchar(11),a_group varchar(30),mentor varchar(10))")
        except:
            print("数据表已存在")

    def inser_pre_id_password(self,name,id,password_sha1,phone_number,group,mentor):#增填数据--预用户密码表
        self.m_cursor.execute(f"insert into pre_exit_id(name,id,password,phone_number,a_group,mentor) Values('{name}','{id}','{password_sha1}','{phone_number}','{group}','{mentor}')")

    def delete_pre_id_password(self,id):#删除数据--预用户密码表
        self.m_cursor.execute(f"delete from pre_exit_id where id = '{id}'")
    def select_id_pre_id_lohin(self,id):#找到指定id的数据
        self.m_cursor.execute(f"select id,password from pre_exit_id where id='{id}';")
        event=self.m_cursor.fetchall()
        if event != ():
            return event[0]
        else:
            return []
    def select_pre_id_login(self):  # 查找用户与密码--预用户密码表
            self.m_cursor.execute("select name,id,phone_number,a_group,mentor from pre_exit_id ;")
            event = self.m_cursor.fetchall()
            l_msg=[]
            if event!=():
                for i in event:
                    d_msg={}
                    d_msg['name']=i[0]
                    d_msg['id'] = i[1]
                    d_msg['phone']=i[2]
                    d_msg['group']=i[3]
                    d_msg['mentor']=i[4]
                    l_msg.append(d_msg)
                return l_msg
            else:
                return l_msg

    # def select_pre_id_login_time(self,startDate,endDate):  # 查找用户与密码--预用户密码表--时间
    #     self.m_cursor.execute("select name,id,phone_number,a_group,mentor from pre_exit_id where ;")
    #     event = self.m_cursor.fetchall()
    #     l_msg = []
    #     if event != ():
    #         for i in event:
    #             d_msg = {}
    #             d_msg['name'] = i[0]
    #             d_msg['id'] = i[1]
    #             d_msg['phone'] = i[2]
    #             d_msg['group'] = i[3]
    #             d_msg['mentor'] = i[4]
    #             l_msg.append(d_msg)
    #         return l_msg
    #     else:
    #         return l_msg


    def build_table_id(self):#建表--用户密码表
        try:
            self.m_cursor.execute(
                "create table exit_id( id varchar(12), password varchar(40),a_signal varchar(5))")
        except:
            print("数据表已存在")
    def select_id_login_signal(self,id):#查找用户与密码--用户密码表--找到signal
        self.m_cursor.execute(f"select a_signal from exit_id where id='{id}'")
        event = self.m_cursor.fetchall()
        if event != ():
            return event[0]
        else:
            return -1
    def select_id_login(self, id, password_sha256):  # 查找用户与密码--用户密码表
        if id != None:
            self.m_cursor.execute("select id,password from exit_id where id={}".format(id))
            event = self.m_cursor.fetchall()
            if event != ():
                if event[0][1] == password_sha256:
                    return 1  # 核实正确
                else:
                    return 0  # 密码错误
            else:
                return -1  # 用户找不到
        else:
            return -1

    def inser_id_password(self,event):#增填数据--用户密码表--user
        self.m_cursor.execute(f"insert into exit_id(id,password,a_signal) Values('{event[0]}','{event[1]}','user')")
    def inser_id_password_admin(self,event):#增填数据--用户密码表--admin
        self.m_cursor.execute(f"insert into exit_id(id,password,a_signal) Values('{event[0]}','{event[1]}','admin')")

    def build_table_experiment(self):#建表--实验表
        try:
            self.m_cursor.execute(
                "create table experiment(id varchar(12),experimenter varchar(10),startDate datetime,endDate datetime,experiment varchar(50),participantNumber varchar(10),fee varchar(10),location varchar(50),url varchar(255))")
        except:
            print("数据表已存在")

    def inser_experiment(self,data):#增添数据--实验表
        if any(d == None for d in data[1:]):
            return 0
        try:
            start_date = datetime.strptime(data[2], '%Y-%m-%d')
            end_date = datetime.strptime(data[3], '%Y-%m-%d')
            query = f"INSERT INTO experiment(id,experimenter,startDate,endDate,experiment,participantNumber,fee,location,url) VALUES (%s , %s, %s, %s, %s, %s, %s, %s, %s)"
            self.m_cursor.execute(query, (
                                          data[0],
                                          data[1],
                                          start_date,
                                          end_date,
                                          data[4],
                                          data[5],
                                          data[6],
                                          data[7],
                                          data[8]
                                          ))
        except Exception as e:
            print(e)
            return -1
        else:
            return 1
    def select_sql_experiment_time(self,startDate,endDate):#查找--实验表--时间
        self.m_cursor.execute("SELECT * FROM experiment WHERE startDate >= %s AND startDate <= %s AND endDate >= %s AND endDate <= %s", (startDate, endDate, startDate, endDate))
        event = self.m_cursor.fetchall()
        l_msg = []
        if event != ():
         if isinstance(event,tuple)and any(isinstance(e,tuple) for e in event):
            for i in event:
                d_msg = {}
                d_msg["experiment"] = i[4]
                d_msg["experimenter"] = i[1]
                d_msg["startDate"] = i[2].strftime("%Y-%m-%d")
                d_msg["endDate"] = i[3].strftime("%Y-%m-%d")
                d_msg["participantNumber"] = i[5]
                d_msg["location"] = i[7]
                d_msg["fee"] = i[6]
                #d_msg["id"]=i[0]
                d_msg["URL"]=i[8]
                l_msg.append(d_msg)
            return l_msg
         else:
            i=event
            d_msg = {}
            d_msg["experiment"] = i[4]
            d_msg["experimenter"] = i[1]
            d_msg["startDate"] = i[2].strftime("%Y-%m-%d")
            d_msg["endDate"] = i[3].strftime("%Y-%m-%d")
            d_msg["participantNumber"] = i[5]
            d_msg["location"] = i[7]
            d_msg["fee"] = i[6]
            #d_msg["id"] = i[0]
            d_msg["URL"] = i[8]
            l_msg.append(d_msg)
            return l_msg
        else:
            return l_msg

    def select_sql_experiment(self):#查找--实验表
        self.m_cursor.execute("select * from experiment")
        event = self.m_cursor.fetchall()
        l_msg = []
        if event != ():
         if isinstance(event,tuple)and any(isinstance(e,tuple) for e in event):
            for i in event:
                d_msg = {}
                d_msg["experiment"] = i[4]
                d_msg["experimenter"] = i[1]
                d_msg["startDate"] = i[2].strftime("%Y-%m-%d")
                d_msg["endDate"] = i[3].strftime("%Y-%m-%d")
                d_msg["participantNumber"] = i[5]
                d_msg["location"] = i[7]
                d_msg["fee"] = i[6]
                #d_msg["id"]=i[0]
                d_msg["URL"]=i[8]
                l_msg.append(d_msg)
            return l_msg
         else:
            i=event
            d_msg = {}
            d_msg["experiment"] = i[4]
            d_msg["experimenter"] = i[1]
            d_msg["startDate"] = i[2].strftime("%Y-%m-%d")
            d_msg["endDate"] = i[3].strftime("%Y-%m-%d")
            d_msg["participantNumber"] = i[5]
            d_msg["location"] = i[7]
            d_msg["fee"] = i[6]
            #d_msg["id"] = i[0]
            d_msg["URL"] = i[8]
            l_msg.append(d_msg)
            return l_msg
        else:
            return l_msg
    def compare_sql_experiment(self,id,experimenter,start_date,end_date,number,fee,location,experiment):#比较--实验表
        if id==None:
            return -1
        #print(f"select id from experiment where experimenter='{experimenter}' and experiment='{experiment}' and startDate='{start_date}' and endDate='{end_date}' and participantNumber='{number}' and fee='{fee}' and location='{location}'")
        self.m_cursor.execute(f"select id from experiment where experimenter='{experimenter}' and experiment='{experiment}' and startDate='{start_date}' and endDate='{end_date}' and participantNumber='{number}' and fee='{fee}' and location='{location}'")
        m_ids=self.m_cursor.fetchall()
        if len(m_ids) == 0:  # 查询结果为空
            return -1
        elif len(m_ids) == 1:  # 查询结果只有一个值
            if ''.join(id) ==m_ids[0][0]:
                return 1
            else:
                return -1
        else:  # 查询结果有多个值
            for m_id in m_ids:
                if ''.join(id) == m_id[0]:
                    return 1
            return -1
    def delete_sql_experiment(self,id,experimenter,start_date,end_date,number,fee,location,experiment):#删除数据--实验表
        start_date_numeric = datetime.strptime(start_date, "%Y-%m-%d").strftime("%Y%m%d")
        end_date_numeric = datetime.strptime(end_date, "%Y-%m-%d").strftime("%Y%m%d")
        event='e'+id+experimenter+start_date_numeric+end_date_numeric+fee+location+experiment
        self.m_cursor.execute(f"drop event {event}")
        self.m_cursor.execute(
            f"delete from experiment where id='{id}' and experimenter='{experimenter}' and experiment='{experiment}' and startDate='{start_date}' and endDate='{end_date}' and participantNumber='{number}' and fee='{fee}' and location='{location}'")

    def create_event_experiment(self, id, experimenter, start_date, end_date, number, fee, location, experiment):#创建事件--实验表
        start_date_numeric = datetime.strptime(start_date, "%Y-%m-%d").strftime("%Y%m%d")
        end_date_numeric = datetime.strptime(end_date, "%Y-%m-%d").strftime("%Y%m%d")
        event='e'+id+experimenter+start_date_numeric+end_date_numeric+fee+location+experiment
        try:
            directives = f"CREATE EVENT {event} ON SCHEDULE AT '{end_date}' DO DELETE FROM experiment WHERE id='{id}' AND experimenter='{experimenter}' AND experiment='{experiment}' AND startDate='{start_date}' AND endDate='{end_date}' AND participantNumber='{number}' AND fee='{fee}' AND location='{location}';"
            self.m_cursor.execute(directives)
        except Exception as e:
            print(e)
