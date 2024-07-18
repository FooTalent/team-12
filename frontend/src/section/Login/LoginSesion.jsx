import Button from '../../components/Button'
import Input from '../../components/Input'
import  {useForm}  from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import loginSchema from '../../validations/login'

const LoginSesion = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
      });
    
      const onSubmit = (data) => {
        console.log(data);
        // Aquí puedes manejar el inicio de sesión, por ejemplo, hacer una solicitud a la API
      };
      
    return (
        <>
  <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md shadow-md p-6 rounded-lg">
      <div className="sm:w-full">
        <h2 className="text-start text-2xl font-bold leading-9 mx-2 tracking-tight text-gray-900">
          Iniciar sesión
        </h2>
      </div>

      <div className="mt-10 sm:w-full">
        <form className="space-y-6" action="" method="" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mx-2 leading-6 text-gray-900 "
            >
              Email
            </label>
            <div className="mt-2">
              <Input placeholder="Ingrese su correo electrónico" className="block w-full"  {...register("email")}/>
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 mx-2 text-gray-900 "
              >
                Contraseña
              </label>
            </div>
            <div>
              <Input placeholder="Ingrese su contraseña" className="block w-full" {...register('password')}/>
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div className="items-center justify-between">
            <Button
              children="Iniciar"
              type="submit"
              className="flex w-full justify-center rounded-md px-6 bg-indigo-600 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</>
   
    )
}

export default LoginSesion