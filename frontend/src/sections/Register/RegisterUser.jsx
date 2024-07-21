import React from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import registerSchema from '../../validations/register';

const RegisterUser = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
  console.log(data);
  };
  const roleOptions = [
    { value: "odontologo", label: "Odontólogo" },
    { value: "secretario", label: "Secretario" }
  ];
  return (
    <>
     <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md shadow-md p-6 rounded-lg">
      <div className="sm:w-full">
        <h2 className="text-start text-2xl font-bold leading-9 mx-2 tracking-tight text-gray-900">
          Registrar usuario
        </h2>
      </div>

      <div className="mt-10 sm:w-full">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className='flex gap-4'>
            <div className="w-1/2">
            
              <label
                htmlFor="name"
                 
                className="block text-sm font-medium mx-2 leading-6 text-gray-900 "
              >
                Nombre *
              </label>
              <div className="mt-2">
                <Input placeholder="Ingrese su nombre" type="text"  className="block w-full"  {...register("name")} />
                {errors.name && <p className="text-red-600">{errors.name.message}</p>}
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="lastName"
                
                className="block text-sm font-medium mx-2 leading-6 text-gray-900 "
              >
                Apellido *
              </label>
              <div className="mt-2">
                <Input placeholder="Ingrese su apellido" type="text"  className="block w-full" {...register("lastName")} />
                
                {errors.lastName && <p className="text-red-600">{errors.lastName.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                
                className="block text-sm font-medium leading-6 mx-2 text-gray-900 "
              >
                Correo electrónico *
              </label>
            </div>
            <div>
              <Input placeholder="Ingrese su correo electrónico" type="text"  className="block w-full" {...register("email")}/>
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className='flex gap-4'>
            <div className="w-1/2">
              <label
                htmlFor="dni"
              
                className="block text-sm font-medium mx-2 leading-6 text-gray-900 "
              >
                DNI *
              </label>
              <div className="mt-2">
                <Input placeholder="Ingrese su Dni" type="text"  className="block w-full"  {...register("dni")} />
                {errors.dni && <p className="text-red-600">{errors.dni.message}</p>}
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="role"
              
                className="block text-sm font-medium mx-2 leading-6 text-gray-900 "
              >
                ROL *
              </label>
              <div className="mt-2">
              <Input type="select"  className="block w-full" options={roleOptions} {...register("role")} />
              {errors.role && <p className="text-red-600">{errors.role.message}</p>}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 mx-2 text-gray-900 "
              >
                Contraseña *
              </label>
            </div>
            <div>
              <Input type="password" placeholder="Ingrese su contraseña" className="block w-full" {...register('password')}/>
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div className='flex gap-4'>
            <div className="w-1/2">
              <label
                htmlFor="phone1"
                 
                className="block text-sm font-medium mx-2 leading-6 text-gray-900 "
              >
                Telefono 1 *
              </label>
              <div className="mt-2">
                <Input placeholder="Ingrese su número" type="text" className="block w-full"  {...register("phone1")} />
                {errors.phone1 && <p className="text-red-600">{errors.phone1.message}</p>}
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="phone2"
                
                className="block text-sm font-medium mx-2 leading-6 text-gray-900 "
              >
               Telefono 2 
              </label>
              <div className="mt-2">
                <Input placeholder="Ingrese su número" type="text"  className="block w-full" {...register("phone2")} />
                {errors.phone2 && <p className="text-red-600">{errors.phone2.message}</p>}
              </div>
            </div>
          </div>

          <div className="items-center justify-between">
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md px-6 bg-mainBlue py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-hoverBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Registrar usuario
            </Button>
          </div>
        </form>
        <Button
              type="button"
              className="flex w-full justify-center rounded-md px-6 bg-white py-1.5 text-sm font-semibold leading-6 text-mainBlue "
            >
              Cancelar
            </Button>
      </div>
    </div>
  </div>
    </>
  )
}

export default RegisterUser