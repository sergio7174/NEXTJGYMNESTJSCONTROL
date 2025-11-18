import axios from 'axios';
import { notifyError} from '@/utils/toast';

export async function GetAllAdminService (setHaveAdmin)  {

    try {
      // get all categories from backend using axios action GET, to const res.
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}`+'api/auth/getalladmin')
      // if got data successfully --> change local category.state with setCategories(res.data.data)
      // new values
      /*alert('res.data.message:'+res.data.message); // line only to test res data
        alert('res.data.status:'+res.data.status);   // line only to test res data
        alert('res.data.data:'+res.data.data);*/     // line only to test res data
      //alert('Estoy en getAllAdminService - line 14 - res.haveAdmintrue:'+res.data.haveAdmin);
      
      if (res.data.haveAdmin=='true') {setHaveAdmin(res.data.haveAdmin)}
    } catch (error) {
      
      notifyError(error, 'Something went wrong in getAllCategory' );
    }
  };
