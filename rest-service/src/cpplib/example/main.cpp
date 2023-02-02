#include <napi.h>
#include "example.h"

namespace {

    Napi::String helloName(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        std::string greeting = Example::helloName((std::string) info[0].ToString());

        return Napi::String::New(env, greeting);
    }
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(
        Napi::String::New(env, "helloName"),
        Napi::Function::New(env, helloName)
    );

    return exports;
}

NODE_API_MODULE(example, Init)